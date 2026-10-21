"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidSlug, normalizeAngolaPhone } from "@/lib/format";
import type { Cor, Tema, Tipo } from "@/lib/types";

type Resultado = { erro?: string; slug?: string };

async function contexto() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const { data: loja } = await supabase.from("lojas").select("id, slug").eq("dono_id", user.id).maybeSingle();
  return { supabase, user, loja };
}

function atualizar(slugLoja?: string) {
  revalidatePath("/painel", "layout");
  if (slugLoja) revalidatePath(`/${slugLoja}`, "layout");
}

export type LojaInput = {
  nome: string; slug: string; whatsapp: string; descricao: string; cidade: string; cor: string; logotipo: string | null;
  tema: Tema; banner: string | null; bannerTitulo: string; bannerTexto: string; aviso: string;
};

export async function guardarLoja(input: LojaInput): Promise<Resultado> {
  const { supabase, user, loja } = await contexto();
  const whatsapp = normalizeAngolaPhone(input.whatsapp);
  const slug = input.slug.trim().toLowerCase();
  if (!input.nome.trim()) return { erro: "Escreve o nome da loja." };
  if (!isValidSlug(slug)) return { erro: "O link usa 3 a 30 letras minúsculas, números ou traços." };
  if (!whatsapp) return { erro: "Escreve um número angolano válido, por exemplo +244 923 847 192." };

  const campos = {
    slug, nome: input.nome.trim(), whatsapp, descricao: input.descricao.trim(), cidade: input.cidade.trim(),
    cor_destaque: /^#[0-9A-Fa-f]{6}$/.test(input.cor) ? input.cor : "#1558D6", logotipo_url: input.logotipo,
    tema: (["vitryne", "boutique", "moderno"] as const).includes(input.tema) ? input.tema : "vitryne",
    banner_url: input.banner, banner_titulo: input.bannerTitulo.trim().slice(0, 80),
    banner_texto: input.bannerTexto.trim().slice(0, 160), aviso: input.aviso.trim().slice(0, 120),
  };
  const { error } = loja
    ? await supabase.from("lojas").update(campos).eq("id", loja.id)
    : await supabase.from("lojas").insert({ ...campos, dono_id: user.id });

  if (error) {
    if (error.code === "23505") return { erro: "Este link já está a ser usado. Escolhe outro." };
    if (error.code === "23514") return { erro: "Este link não está disponível. Escolhe outro." };
    return { erro: "Não foi possível guardar a loja. Tenta outra vez." };
  }
  atualizar(slug);
  if (loja && loja.slug !== slug) revalidatePath(`/${loja.slug}`, "layout");
  return { slug };
}

export type ProdutoInput = {
  id?: string; nome: string; preco: number; categoria: string; descricao: string; tipo: Tipo;
  tamanhos: string[]; cores: Cor[]; fotos: string[]; activo?: boolean;
};

function criarSlug(nome: string): string {
  return nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "produto";
}

export async function guardarProduto(input: ProdutoInput): Promise<Resultado> {
  const { supabase, loja } = await contexto();
  if (!loja) return { erro: "Cria primeiro a tua loja." };
  if (!input.nome.trim()) return { erro: "Escreve o nome do produto." };
  if (!(input.preco > 0)) return { erro: "Escreve um preço maior que zero." };
  if (input.tamanhos.length === 0) return { erro: "Escolhe pelo menos um tamanho." };
  if (input.cores.length === 0) return { erro: "Adiciona pelo menos uma cor." };

  let id = input.id;
  const campos = {
    nome: input.nome.trim(), preco: Math.round(input.preco), categoria: input.categoria.trim(),
    descricao: input.descricao.trim(), tipo: input.tipo, activo: input.activo ?? true,
  };

  if (id) {
    const { error } = await supabase.from("produtos").update(campos).eq("id", id).eq("loja_id", loja.id);
    if (error) return { erro: "Não foi possível guardar o produto." };
  } else {
    const base = criarSlug(input.nome);
    const { data: existentes } = await supabase.from("produtos").select("slug").eq("loja_id", loja.id).like("slug", `${base}%`);
    const usados = new Set((existentes ?? []).map((p) => p.slug));
    let slug = base;
    for (let n = 2; usados.has(slug); n++) slug = `${base}-${n}`;
    const { data, error } = await supabase.from("produtos").insert({ ...campos, loja_id: loja.id, slug }).select("id").single();
    if (error || !data) {
      // Os limites do plano vêm da base de dados (trigger), já escritos para o vendedor.
      return { erro: error?.code === "P0001" ? error.message : "Não foi possível criar o produto." };
    }
    id = data.id;
  }

  // Substitui variantes e fotos pelos valores do formulário.
  await supabase.from("variantes").delete().eq("produto_id", id);
  await supabase.from("imagens").delete().eq("produto_id", id);
  const variantes = input.tamanhos.flatMap((tamanho) => input.cores.map((c) => ({ produto_id: id, tamanho, cor: c.nome, cor_hex: c.hex })));
  const { error: ev } = await supabase.from("variantes").insert(variantes);
  if (ev) return { erro: "Não foi possível guardar tamanhos e cores." };
  if (input.fotos.length) {
    await supabase.from("imagens").insert(input.fotos.map((url, ordem) => ({ produto_id: id, url, ordem })));
  }
  atualizar(loja.slug);
  return {};
}

export async function alternarProduto(id: string, activo: boolean) {
  const { supabase, loja } = await contexto();
  if (!loja) return;
  await supabase.from("produtos").update({ activo }).eq("id", id).eq("loja_id", loja.id);
  atualizar(loja.slug);
}

export async function apagarProduto(id: string) {
  const { supabase, loja } = await contexto();
  if (!loja) return;
  await supabase.from("produtos").delete().eq("id", id).eq("loja_id", loja.id);
  atualizar(loja.slug);
}

export async function marcarVendido(id: string, vendido: boolean) {
  const { supabase, loja } = await contexto();
  if (!loja) return;
  await supabase.from("cliques").update({ vendido }).eq("id", id).eq("loja_id", loja.id);
  revalidatePath("/painel/pedidos");
}

export async function terminarSessao() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
