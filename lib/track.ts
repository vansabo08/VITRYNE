/**
 * Regista visitas e cliques com a chave pública (a RLS só deixa inserir em lojas e produtos activos).
 * `keepalive` faz o pedido sobreviver à abertura do WhatsApp. Falhas nunca interrompem o cliente.
 */
function enviar(tabela: "visitas" | "cliques", dados: Record<string, string | null>) {
  try {
    void fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${tabela}`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(dados),
    }).catch(() => {});
  } catch {
    // Sem rede ou bloqueado: o pedido ao vendedor continua.
  }
}

export function registarClique(d: { lojaId: string; produtoId: string; tamanho: string; cor: string }) {
  enviar("cliques", { loja_id: d.lojaId, produto_id: d.produtoId, tamanho: d.tamanho, cor: d.cor });
}

/** Uma visita por página e por sessão do browser, para um refresh não contar duas vezes. */
export function registarVisita(d: { lojaId: string; produtoId?: string }) {
  const chave = `v:${d.lojaId}:${d.produtoId ?? "loja"}`;
  try {
    if (sessionStorage.getItem(chave)) return;
    sessionStorage.setItem(chave, "1");
  } catch {
    // sessionStorage indisponível: conta na mesma.
  }
  enviar("visitas", { loja_id: d.lojaId, produto_id: d.produtoId ?? null });
}
