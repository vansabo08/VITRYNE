import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLojaPublica, getProduto } from "@/lib/data";
import { formatKz } from "@/lib/format";
import { SITE_URL, resumo } from "@/lib/site";
import { ProductPurchase } from "@/components/ProductPurchase";
import { TrackVisit } from "@/components/TrackVisit";
import { CartaoProduto, RodapeLoja, produtosVisiveis } from "@/components/loja/comum";
import { TopoVitryne } from "@/components/loja/TemaVitryne";
import { TopoBoutique } from "@/components/loja/TemaBoutique";
import { TopoModerno } from "@/components/loja/TemaModerno";

type Props = { params: Promise<{ loja: string; produto: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { loja: slugLoja, produto: slugProduto } = await params;
  const loja = await getLojaPublica(slugLoja);
  const produto = loja && getProduto(loja, slugProduto);
  if (!loja || !produto) return { title: "Produto não encontrado", robots: { index: false } };

  const titulo = `${produto.nome}, ${formatKz(produto.preco)}`;
  const descricao = resumo(
    `${produto.descricao ? produto.descricao + " " : ""}Tamanhos ${produto.tamanhos.join(", ")}. Pede no WhatsApp de ${loja.nome}.`,
  );
  const caminho = `/${loja.slug}/${produto.slug}`;
  return {
    title: { absolute: `${titulo} | ${loja.nome}` },
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: { type: "website", url: caminho, siteName: loja.nome, title: titulo, description: descricao },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { loja: slugLoja, produto: slugProduto } = await params;
  const loja = await getLojaPublica(slugLoja);
  const produto = loja && getProduto(loja, slugProduto);
  if (!loja || !produto) notFound();

  const url = `${SITE_URL}/${loja.slug}/${produto.slug}`;
  const Topo = { vitryne: TopoVitryne, boutique: TopoBoutique, moderno: TopoModerno }[loja.tema];

  // "Também podes gostar": primeiro da mesma categoria, depois os restantes.
  const outros = produtosVisiveis(loja).filter((p) => p.id !== produto.id);
  const relacionados = [...outros.filter((p) => p.categoria === produto.categoria), ...outros.filter((p) => p.categoria !== produto.categoria)].slice(0, 4);

  return (
    <>
      <TrackVisit lojaId={loja.id} produtoId={produto.id} />
      <Topo loja={loja} voltar />
      <main id="conteudo" className="mx-auto max-w-6xl px-4 md:pt-8">
        <ProductPurchase loja={loja} produto={produto} url={url} />

        {relacionados.length > 0 && (
          <section className="mt-20" aria-labelledby="relacionados">
            <h2 id="relacionados" className={`text-center ${loja.tema === "boutique" ? "letra-revista text-3xl" : "text-xl font-bold"}`}>Também podes gostar</h2>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {relacionados.map((p) => (
                <li key={p.id}><CartaoProduto loja={loja} produto={p} variante={loja.tema} /></li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <RodapeLoja loja={loja} />
    </>
  );
}
