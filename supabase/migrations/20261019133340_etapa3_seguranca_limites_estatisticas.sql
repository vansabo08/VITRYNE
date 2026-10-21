-- 1. O vendedor não pode mexer no plano, na validade, no dono nem no estado da loja.
revoke insert, update on public.lojas from anon, authenticated;
grant insert (dono_id, slug, nome, descricao, logotipo_url, whatsapp, cor_destaque, cidade) on public.lojas to authenticated;
grant update (slug, nome, descricao, logotipo_url, whatsapp, cor_destaque, cidade) on public.lojas to authenticated;

-- Uma loja por vendedor (impede contornar o limite de produtos com várias lojas).
alter table public.lojas add constraint lojas_dono_unico unique (dono_id);

-- 2. Cliques e visitas são públicos de escrita: só as colunas necessárias, com tamanhos limitados.
revoke insert, update on public.cliques from anon, authenticated;
grant insert (loja_id, produto_id, tamanho, cor) on public.cliques to anon, authenticated;
grant update (vendido) on public.cliques to authenticated;
revoke insert, update on public.visitas from anon, authenticated;
grant insert (loja_id, produto_id) on public.visitas to anon, authenticated;
alter table public.cliques add constraint cliques_tamanho_len check (char_length(tamanho) <= 30);
alter table public.cliques add constraint cliques_cor_len check (char_length(cor) <= 40);

-- 3. Limites dos planos: Grátis 10, Básico 50, Pro ilimitado. Plano expirado não deixa criar produtos.
create function public.verificar_limite_produtos() returns trigger
language plpgsql set search_path = '' as $$
declare
  l record;
  n integer;
  maximo integer;
begin
  select plano, plano_validade into l from public.lojas where id = new.loja_id;
  if l.plano_validade < now() then
    raise exception 'O teu plano expirou. Fala connosco para renovar e voltar a adicionar produtos.';
  end if;
  maximo := case l.plano when 'gratis' then 10 when 'basico' then 50 else null end;
  if maximo is not null then
    select count(*) into n from public.produtos where loja_id = new.loja_id;
    if n >= maximo then
      raise exception 'Atingiste o limite de % produtos do teu plano. Passa para um plano superior para adicionar mais.', maximo;
    end if;
  end if;
  return new;
end $$;

create trigger produtos_limite_plano before insert on public.produtos
for each row execute function public.verificar_limite_produtos();

-- 4. Estatísticas só no plano Pro (activo): a RLS das visitas passa a exigir isso.
create function private.loja_pro(p_loja uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.lojas l
    where l.id = p_loja and l.dono_id = (select auth.uid()) and l.plano = 'pro' and l.plano_validade > now()
  );
$$;
revoke execute on function private.loja_pro(uuid) from public;
grant execute on function private.loja_pro(uuid) to anon, authenticated;

drop policy visitas_leitura on public.visitas;
create policy visitas_leitura on public.visitas for select to authenticated using (private.loja_pro(loja_id));

create function public.estatisticas(p_loja uuid, p_dias integer default 30) returns jsonb
language sql stable set search_path = '' as $$
  with limite as (select now() - make_interval(days => p_dias) as desde),
  hoje as (select (now() at time zone 'Africa/Luanda')::date as d)
  select jsonb_build_object(
    'visitas', (select count(*) from public.visitas, limite where loja_id = p_loja and created_at >= limite.desde),
    'cliques', (select count(*) from public.cliques, limite where loja_id = p_loja and created_at >= limite.desde),
    'por_dia', (
      select coalesce(jsonb_agg(jsonb_build_object('dia', g.dia, 'visitas', coalesce(v.n, 0), 'cliques', coalesce(c.n, 0)) order by g.dia), '[]'::jsonb)
      from hoje, generate_series(hoje.d - (p_dias - 1), hoje.d, interval '1 day') as g(dia)
      left join (select (created_at at time zone 'Africa/Luanda')::date as dia, count(*) as n from public.visitas where loja_id = p_loja group by 1) v on v.dia = g.dia::date
      left join (select (created_at at time zone 'Africa/Luanda')::date as dia, count(*) as n from public.cliques where loja_id = p_loja group by 1) c on c.dia = g.dia::date
    ),
    'produtos', (
      select coalesce(jsonb_agg(x order by x.visitas desc, x.cliques desc), '[]'::jsonb) from (
        select p.id, p.nome,
          (select count(*) from public.visitas v, limite where v.produto_id = p.id and v.created_at >= limite.desde) as visitas,
          (select count(*) from public.cliques c, limite where c.produto_id = p.id and c.created_at >= limite.desde) as cliques
        from public.produtos p where p.loja_id = p_loja
        order by 3 desc, 4 desc limit 5
      ) x
    )
  );
$$;
revoke execute on function public.estatisticas(uuid, integer) from public, anon;
grant execute on function public.estatisticas(uuid, integer) to authenticated;
