-- As funções auxiliares da RLS saem do schema public para não ficarem expostas por RPC.
create schema if not exists private;
grant usage on schema private to anon, authenticated;
alter function public.e_dono_da_loja(uuid) set schema private;
alter function public.produto_publico(uuid) set schema private;
alter function public.e_dono_do_produto(uuid) set schema private;
