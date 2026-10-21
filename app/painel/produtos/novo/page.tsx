import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { requireLoja } from "@/lib/painel";
import { estadoPlano } from "@/lib/plans";

export default async function NovoProduto() {
  const loja = await requireLoja();
  const { cheio, expirado, plano } = estadoPlano(loja);

  if (cheio) {
    return (
      <div className="vidro rounded-2xl p-8">
        <h1 className="text-3xl font-bold">{expirado ? "O teu plano expirou" : "Limite do plano atingido"}</h1>
        <p className="mt-2 text-base">
          {expirado
            ? "Renova o plano para voltar a adicionar produtos."
            : `O plano ${plano.nome} permite ${plano.limiteTexto.toLowerCase()}. Passa para um plano superior para adicionar mais.`}
        </p>
        <Link href="/painel/plano" className="mt-4 inline-block btn rounded-md bg-brand px-6 py-3 text-white hover:bg-[#2A6BE6]">Ver planos</Link>
      </div>
    );
  }
  return <ProductForm />;
}
