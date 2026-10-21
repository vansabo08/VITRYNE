import Link from "next/link";
import { ArrowDown, ArrowLeft, MapPin, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { Loja } from "@/lib/types";
import { AvatarLoja, FiltroCategorias, Garantias, GrelhaProdutos, RodapeLoja, contactoWhatsApp } from "./comum";

/** Barra de vidro fixa no topo (montra e ficha). */
export function TopoVitryne({ loja, voltar }: { loja: Loja; voltar?: boolean }) {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3">
      <div className="vidro mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {voltar && (
            <Link href={`/${loja.slug}`} aria-label="Voltar à loja" className="rounded-lg p-2 text-mute transition-colors hover:text-ink">
              <ArrowLeft className="size-5" weight="bold" />
            </Link>
          )}
          <Link href={`/${loja.slug}`} className="flex min-w-0 items-center gap-3">
            <AvatarLoja loja={loja} className="size-9 shrink-0 text-sm" />
            <span className="truncate text-base font-bold">{loja.nome}</span>
          </Link>
        </div>
        <a href={contactoWhatsApp(loja)} target="_blank" rel="noopener" aria-label={`Falar com ${loja.nome} no WhatsApp`} className="flex shrink-0 items-center gap-2 rounded-xl bg-wa px-3 py-2 text-xs font-semibold text-white hover:brightness-110">
          <WhatsappLogo className="size-4" weight="fill" /> <span className="hidden sm:inline">Falar connosco</span>
        </a>
      </div>
    </header>
  );
}

export function MontraVitryne({ loja, categoria }: { loja: Loja; categoria?: string }) {
  const titulo = loja.bannerTitulo || loja.nome;
  const texto = loja.bannerTexto || loja.descricao;
  return (
    <>
      <TopoVitryne loja={loja} />
      <main id="conteudo" className="mx-auto max-w-6xl px-4 pt-6">
        {loja.banner ? (
          <section className="relative overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={loja.banner} alt="" className="aspect-[4/5] w-full object-cover sm:aspect-[21/9]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">{titulo}</h1>
              {texto && <p className="mt-3 max-w-xl text-base text-white/80">{texto}</p>}
              <a href="#produtos" className="btn mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                Ver produtos <ArrowDown className="size-4" weight="bold" />
              </a>
            </div>
          </section>
        ) : (
          <section className="py-8 md:py-14">
            <AvatarLoja loja={loja} className="size-16 text-2xl md:size-20 md:text-3xl" />
            <h1 className="mt-6 text-5xl font-bold leading-none md:text-7xl">{titulo}</h1>
            {texto && <p className="mt-4 max-w-xl text-base leading-7 text-mute md:text-lg">{texto}</p>}
            {loja.cidade && (
              <p className="etiqueta mt-5 flex items-center gap-1.5 text-realce"><MapPin className="size-4" weight="fill" /> {loja.cidade}</p>
            )}
          </section>
        )}

        <div className="mt-8"><Garantias loja={loja} variante="vitryne" /></div>

        <section id="produtos" className="mt-12 scroll-mt-24">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold md:text-3xl">{categoria ?? "Todos os produtos"}</h2>
          </div>
          <FiltroCategorias loja={loja} activa={categoria} variante="vitryne" />
          <div className="mt-6"><GrelhaProdutos loja={loja} categoria={categoria} variante="vitryne" /></div>
        </section>
      </main>
      <RodapeLoja loja={loja} />
    </>
  );
}
