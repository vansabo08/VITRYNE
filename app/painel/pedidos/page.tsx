import { OrderList, type Pedido } from "@/components/OrderList";
import { requireLoja } from "@/lib/painel";
import { createClient } from "@/lib/supabase/server";

export default async function Pedidos() {
  const loja = await requireLoja();
  const supabase = await createClient();
  const { data } = await supabase
    .from("cliques")
    .select("id, tamanho, cor, vendido, created_at, produto_id")
    .eq("loja_id", loja.id)
    .order("created_at", { ascending: false })
    .limit(200);

  const produtos = new Map(loja.produtos.map((p) => [p.id, p]));
  const pedidos: Pedido[] = (data ?? []).map((c) => {
    const p = produtos.get(c.produto_id);
    return {
      id: c.id, tamanho: c.tamanho, cor: c.cor, vendido: c.vendido, data: c.created_at,
      produto: p?.nome ?? "Produto apagado", preco: p?.preco ?? 0, foto: p?.fotos[0], tipo: p?.tipo ?? "outro",
      link: p ? `/${loja.slug}/${p.slug}` : null,
    };
  });
  return <OrderList pedidos={pedidos} />;
}
