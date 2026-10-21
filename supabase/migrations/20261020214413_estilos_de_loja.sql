-- Estilos de montra (disponíveis em todos os planos) e conteúdo do banner.
alter table public.lojas
  add column tema text not null default 'vitryne' check (tema in ('vitryne', 'boutique', 'moderno')),
  add column banner_url text,
  add column banner_titulo text not null default '' check (char_length(banner_titulo) <= 80),
  add column banner_texto text not null default '' check (char_length(banner_texto) <= 160),
  add column aviso text not null default '' check (char_length(aviso) <= 120);

-- O vendedor pode escrever estas colunas (como as outras da identidade da loja).
grant insert (tema, banner_url, banner_titulo, banner_texto, aviso) on public.lojas to authenticated;
grant update (tema, banner_url, banner_titulo, banner_texto, aviso) on public.lojas to authenticated;
