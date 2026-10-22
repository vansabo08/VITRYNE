import type { Tipo } from "./types";

/**
 * Tipos de produto. Servem para sugerir tamanhos no painel, escolher o ícone sem foto
 * e decidir se há guia de tamanhos. Tamanho e cor são sempre opcionais.
 */
export const TIPOS: { id: Tipo; nome: string; tamanhos: string[] }[] = [
  { id: "roupa", nome: "Roupa", tamanhos: ["P", "M", "G", "GG"] },
  { id: "calcado", nome: "Calçado", tamanhos: Array.from({ length: 11 }, (_, i) => String(36 + i)) },
  { id: "acessorios", nome: "Acessórios", tamanhos: [] },
  { id: "beleza", nome: "Beleza", tamanhos: [] },
  { id: "electronica", nome: "Electrónica", tamanhos: [] },
  { id: "casa", nome: "Casa", tamanhos: [] },
  { id: "comida", nome: "Comida e bebida", tamanhos: [] },
  { id: "outro", nome: "Outro", tamanhos: [] },
];

export const IDS_TIPO = TIPOS.map((t) => t.id);

/** Só roupa e calçado têm medidas-padrão para o guia de tamanhos. */
export const temGuiaTamanhos = (tipo: Tipo) => tipo === "roupa" || tipo === "calcado";
