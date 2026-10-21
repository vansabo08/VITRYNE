create table public.lojas (
  id uuid primary key default gen_random_uuid(),
  dono_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  nome text not null,
  descricao text not null default '',
  logotipo_url text,
  whatsapp text not null,
  cor_destaque text not null default '#1558D6',
  cidade text not null default '',
  activa boolean not null default true,
  plano text not null default 'gratis' check (plano in ('gratis','basico','pro')),
  plano_validade timestamptz not null default (now() + interval '1 month'),
  created_at timestamptz not null default now(),
  constraint lojas_slug_formato check (slug ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'),
  constraint lojas_slug_reservado check (slug not in ('painel','entrar','registo','privacidade','termos','api','admin','vitryne')),
  constraint lojas_whatsapp_formato check (whatsapp ~ '^2449[0-9]{8}$'),
  constraint lojas_cor_formato check (cor_destaque ~ '^#[0-9A-Fa-f]{6}$')
);
create index lojas_dono_idx on public.lojas(dono_id);

create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  slug text not null,
  nome text not null,
  descricao text not null default '',
  preco integer not null check (preco > 0),
  categoria text not null default '',
  tipo text not null check (tipo in ('calcado','roupa')),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  unique (loja_id, slug)
);
create index produtos_loja_idx on public.produtos(loja_id);

create table public.imagens (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references public.produtos(id) on delete cascade,
  url text not null,
  ordem integer not null default 0
);
create index imagens_produto_idx on public.imagens(produto_id);

create table public.variantes (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references public.produtos(id) on delete cascade,
  tamanho text not null,
  cor text not null,
  cor_hex text not null default '#CCCCCC' check (cor_hex ~ '^#[0-9A-Fa-f]{6}$'),
  unique (produto_id, tamanho, cor)
);
create index variantes_produto_idx on public.variantes(produto_id);

create table public.cliques (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  produto_id uuid not null references public.produtos(id) on delete cascade,
  tamanho text not null,
  cor text not null,
  vendido boolean not null default false,
  created_at timestamptz not null default now()
);
create index cliques_loja_idx on public.cliques(loja_id, created_at desc);

create table public.visitas (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  produto_id uuid references public.produtos(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index visitas_loja_idx on public.visitas(loja_id, created_at desc);

alter table public.lojas enable row level security;
alter table public.produtos enable row level security;
alter table public.imagens enable row level security;
alter table public.variantes enable row level security;
alter table public.cliques enable row level security;
alter table public.visitas enable row level security;

-- Funções auxiliares (security definer, sem expor dados): evitam repetir subconsultas nas políticas.
create function public.e_dono_da_loja(p_loja uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.lojas l where l.id = p_loja and l.dono_id = (select auth.uid()));
$$;

create function public.produto_publico(p_produto uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.produtos p join public.lojas l on l.id = p.loja_id
    where p.id = p_produto and p.activo and l.activa
  );
$$;

create function public.e_dono_do_produto(p_produto uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.produtos p join public.lojas l on l.id = p.loja_id
    where p.id = p_produto and l.dono_id = (select auth.uid())
  );
$$;

revoke execute on function public.e_dono_da_loja(uuid), public.produto_publico(uuid), public.e_dono_do_produto(uuid) from public;
grant execute on function public.e_dono_da_loja(uuid), public.produto_publico(uuid), public.e_dono_do_produto(uuid) to anon, authenticated;

-- lojas
create policy lojas_leitura on public.lojas for select using (activa or dono_id = (select auth.uid()));
create policy lojas_criar on public.lojas for insert to authenticated with check (dono_id = (select auth.uid()));
create policy lojas_editar on public.lojas for update to authenticated using (dono_id = (select auth.uid())) with check (dono_id = (select auth.uid()));
create policy lojas_apagar on public.lojas for delete to authenticated using (dono_id = (select auth.uid()));

-- produtos
create policy produtos_leitura on public.produtos for select
  using ((activo and exists (select 1 from public.lojas l where l.id = loja_id and l.activa)) or public.e_dono_da_loja(loja_id));
create policy produtos_criar on public.produtos for insert to authenticated with check (public.e_dono_da_loja(loja_id));
create policy produtos_editar on public.produtos for update to authenticated using (public.e_dono_da_loja(loja_id)) with check (public.e_dono_da_loja(loja_id));
create policy produtos_apagar on public.produtos for delete to authenticated using (public.e_dono_da_loja(loja_id));

-- imagens
create policy imagens_leitura on public.imagens for select using (public.produto_publico(produto_id) or public.e_dono_do_produto(produto_id));
create policy imagens_criar on public.imagens for insert to authenticated with check (public.e_dono_do_produto(produto_id));
create policy imagens_editar on public.imagens for update to authenticated using (public.e_dono_do_produto(produto_id)) with check (public.e_dono_do_produto(produto_id));
create policy imagens_apagar on public.imagens for delete to authenticated using (public.e_dono_do_produto(produto_id));

-- variantes
create policy variantes_leitura on public.variantes for select using (public.produto_publico(produto_id) or public.e_dono_do_produto(produto_id));
create policy variantes_criar on public.variantes for insert to authenticated with check (public.e_dono_do_produto(produto_id));
create policy variantes_editar on public.variantes for update to authenticated using (public.e_dono_do_produto(produto_id)) with check (public.e_dono_do_produto(produto_id));
create policy variantes_apagar on public.variantes for delete to authenticated using (public.e_dono_do_produto(produto_id));

-- cliques: qualquer visitante regista um clique num produto público; só o dono lê e marca como vendido
create policy cliques_registar on public.cliques for insert to anon, authenticated
  with check (public.produto_publico(produto_id) and exists (select 1 from public.produtos p where p.id = produto_id and p.loja_id = cliques.loja_id));
create policy cliques_leitura on public.cliques for select to authenticated using (public.e_dono_da_loja(loja_id));
create policy cliques_editar on public.cliques for update to authenticated using (public.e_dono_da_loja(loja_id)) with check (public.e_dono_da_loja(loja_id));
create policy cliques_apagar on public.cliques for delete to authenticated using (public.e_dono_da_loja(loja_id));

-- visitas
create policy visitas_registar on public.visitas for insert to anon, authenticated
  with check (exists (select 1 from public.lojas l where l.id = loja_id and l.activa));
create policy visitas_leitura on public.visitas for select to authenticated using (public.e_dono_da_loja(loja_id));

-- Storage: bucket público para leitura; escrita só do dono, na pasta com o seu id
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vitryne', 'vitryne', true, 2097152, array['image/webp','image/jpeg','image/png'])
on conflict (id) do nothing;

create policy "vitryne_escrever" on storage.objects for insert to authenticated
  with check (bucket_id = 'vitryne' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "vitryne_editar" on storage.objects for update to authenticated
  using (bucket_id = 'vitryne' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "vitryne_apagar" on storage.objects for delete to authenticated
  using (bucket_id = 'vitryne' and (storage.foldername(name))[1] = (select auth.uid())::text);
