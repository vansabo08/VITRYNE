export type Tipo = "calcado" | "roupa";
export type Plano = "gratis" | "basico" | "pro";
export type Tema = "vitryne" | "boutique" | "moderno";

export type Cor = { nome: string; hex: string };

export type Produto = {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  tipo: Tipo;
  tamanhos: string[];
  cores: Cor[];
  /** URLs das fotos. Um valor que começa por "#" é um tom liso de demonstração. */
  fotos: string[];
  activo: boolean;
};

export type Loja = {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  logotipo: string | null;
  whatsapp: string;
  destaque: string;
  cidade: string;
  plano: Plano;
  planoValidade: string;
  tema: Tema;
  banner: string | null;
  bannerTitulo: string;
  bannerTexto: string;
  aviso: string;
  produtos: Produto[];
};

export type Clique = {
  id: string;
  produto: string;
  tamanho: string;
  cor: string;
  data: string;
  vendido: boolean;
};
