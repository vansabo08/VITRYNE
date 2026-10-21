import { ProductList } from "@/components/ProductList";
import { requireLoja } from "@/lib/painel";
import { estadoPlano } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";
import { haDias } from "@/lib/datas";

export default async function Produtos() {
  const loja = await requireLoja();
  const { plano, cheio, expirado } = estadoPlano(loja);

  // Interesse por produto nos últimos 30 dias, para o vendedor ver o que está a puxar pedidos.
  const supabase = await createClient();
  const { data } = await supabase
    .from("cliques")
    .select("produto_id")
    .eq("loja_id", loja.id)
    .gte("created_at", haDias(30));
  const pedidos: Record<string, number> = {};
  (data ?? []).forEach((c) => (pedidos[c.produto_id] = (pedidos[c.produto_id] ?? 0) + 1));

  return <ProductList produtos={loja.produtos} limite={plano.limite} planoNome={plano.nome} cheio={cheio} expirado={expirado} pedidos={pedidos} />;
}
