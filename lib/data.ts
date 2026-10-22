import { cache } from "react";
import type { Cor, Loja, Produto, Tema, Tipo } from "./types";
import { createPublicClient } from "./supabase/public";

const ORDEM_ROUPA = ["P", "M", "G", "GG"];

type ImagemRow = { url: string; ordem: number };
type VarianteRow = { tamanho: string; cor: string; cor_hex: string };
type ProdutoRow = {
  id: string; slug: string; nome: string; descricao: string; preco: number; categoria: string;
  tipo: Tipo; activo: boolean; created_at: string; imagens: ImagemRow[]; variantes: VarianteRow[];
};
export type LojaRow = {
  id: string; slug: string; nome: string; descricao: string; logotipo_url: string | null; whatsapp: string;
  cor_destaque: string; cidade: string; plano: Loja["plano"]; plano_validade: string; produtos: ProdutoRow[];
  tema: Tema | null; banner_url: string | null; banner_titulo: string | null; banner_texto: string | null; aviso: string | null;
};

/** Selecção usada em todas as leituras de loja com produtos. */
export const LOJA_SELECT = "*, produtos(*, imagens(url, ordem), variantes(tamanho, cor, cor_hex))";

/** Roupa segue P, M, G, GG; o resto (números, "500 ml", "128 GB") em ordem natural. */
function ordenarTamanhos(tamanhos: string[], tipo: Tipo): string[] {
  const unicos = Array.from(new Set(tamanhos.filter(Boolean)));
  const natural = (a: string, b: string) => a.localeCompare(b, "pt", { numeric: true });
  if (tipo !== "roupa") return unicos.sort(natural);
  const pos = (t: string) => (ORDEM_ROUPA.includes(t) ? ORDEM_ROUPA.indexOf(t) : ORDEM_ROUPA.length);
  return unicos.sort((a, b) => pos(a) - pos(b) || natural(a, b));
}

function mapProduto(p: ProdutoRow): Produto {
  // Uma variante com cor '' ou tamanho '' quer dizer que essa opção não se aplica.
  const cores = new Map<string, Cor>();
  p.variantes.forEach((v) => v.cor && cores.set(v.cor, { nome: v.cor, hex: v.cor_hex }));
  return {
    id: p.id, slug: p.slug, nome: p.nome, descricao: p.descricao, preco: p.preco,
    categoria: p.categoria, tipo: p.tipo, activo: p.activo,
    tamanhos: ordenarTamanhos(p.variantes.map((v) => v.tamanho), p.tipo),
    cores: Array.from(cores.values()),
    fotos: [...p.imagens].sort((a, b) => a.ordem - b.ordem).map((i) => i.url),
  };
}

export function mapLoja(row: LojaRow): Loja {
  return {
    id: row.id, slug: row.slug, nome: row.nome, descricao: row.descricao, logotipo: row.logotipo_url,
    whatsapp: row.whatsapp, destaque: row.cor_destaque, cidade: row.cidade, plano: row.plano,
    planoValidade: row.plano_validade,
    tema: row.tema ?? "vitryne", banner: row.banner_url, bannerTitulo: row.banner_titulo ?? "",
    bannerTexto: row.banner_texto ?? "", aviso: row.aviso ?? "",
    produtos: [...row.produtos].sort((a, b) => b.created_at.localeCompare(a.created_at)).map(mapProduto),
  };
}

/**
 * Loja pública. A RLS só devolve lojas e produtos activos. Com cache, metadados e página partilham a consulta.
 * Uma falha de rede lança erro ("tentar de novo") em vez de passar por loja inexistente (404).
 */
export const getLojaPublica = cache(async (slug: string): Promise<Loja | null> => {
  const { data, error } = await createPublicClient().from("lojas").select(LOJA_SELECT).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Falha ao ler a loja ${slug}: ${error.message}`);
  return data ? mapLoja(data as unknown as LojaRow) : null;
});

export function getProduto(loja: Loja, slug: string): Produto | undefined {
  return loja.produtos.find((p) => p.slug === slug && p.activo);
}
