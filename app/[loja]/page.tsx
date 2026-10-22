import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLojaPublica } from "@/lib/data";
import { resumo } from "@/lib/site";
import { TrackVisit } from "@/components/TrackVisit";
import { categoriasDe } from "@/components/loja/comum";
import { MontraVitryne } from "@/components/loja/TemaVitryne";
import { MontraBoutique } from "@/components/loja/TemaBoutique";
import { MontraModerno } from "@/components/loja/TemaModerno";

type Props = { params: Promise<{ loja: string }>; searchParams: Promise<{ categoria?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { loja: slug } = await params;
  const loja = await getLojaPublica(slug);
  if (!loja) return { title: "Loja não encontrada", robots: { index: false } };

  const descricao = resumo(
    loja.descricao ||
      `Produtos de ${loja.nome}${loja.cidade ? ` em ${loja.cidade}` : ""}. Escolhe o que queres e pede no WhatsApp.`,
  );
  return {
    title: loja.nome,
    description: descricao,
    alternates: { canonical: `/${loja.slug}` },
    openGraph: { type: "website", url: `/${loja.slug}`, siteName: loja.nome, title: loja.nome, description: descricao },
  };
}

export default async function LojaPage({ params, searchParams }: Props) {
  const { loja: slug } = await params;
  const loja = await getLojaPublica(slug);
  if (!loja) notFound();

  // Só aceita categorias que existem, para um link estranho não dar uma grelha vazia.
  const { categoria: pedida } = await searchParams;
  const categoria = pedida && categoriasDe(loja).includes(pedida) ? pedida : undefined;

  const Montra = { vitryne: MontraVitryne, boutique: MontraBoutique, moderno: MontraModerno }[loja.tema];
  return (
    <>
      <TrackVisit lojaId={loja.id} />
      <Montra loja={loja} categoria={categoria} />
    </>
  );
}
