-- A VITRYNE passa a servir qualquer negócio: mais tipos de produto.
alter table public.produtos drop constraint produtos_tipo_check;
alter table public.produtos add constraint produtos_tipo_check
  check (tipo in ('roupa', 'calcado', 'acessorios', 'beleza', 'electronica', 'casa', 'comida', 'outro'));

-- Tamanho e cor passam a opcionais: '' quer dizer "não se aplica". O texto é livre, por isso fica limitado.
alter table public.variantes add constraint variantes_tamanho_len check (char_length(tamanho) <= 30);
alter table public.variantes add constraint variantes_cor_len check (char_length(cor) <= 40);
