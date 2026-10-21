import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { LOJA_SELECT, mapLoja, type LojaRow } from "./data";
import type { Loja } from "./types";

/**
 * Utilizador autenticado e a sua loja (ou null se ainda não criou). A RLS garante que só vê o que é seu.
 * Com `cache`, o layout e a página partilham a mesma consulta no mesmo pedido.
 */
export const getMinhaLoja = cache(async (): Promise<{ email: string; loja: Loja | null }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const { data } = await supabase.from("lojas").select(LOJA_SELECT).eq("dono_id", user.id).maybeSingle();
  return { email: user.email ?? "", loja: data ? mapLoja(data as unknown as LojaRow) : null };
});

/** Para as páginas do painel que precisam de loja: sem loja, vai criá-la. */
export async function requireLoja(): Promise<Loja> {
  const { loja } = await getMinhaLoja();
  if (!loja) redirect("/painel/loja");
  return loja;
}
