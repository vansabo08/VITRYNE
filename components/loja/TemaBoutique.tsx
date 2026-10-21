import Link from "next/link";
import { ArrowLeft, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { Loja } from "@/lib/types";
import { FiltroCategorias, Garantias, GrelhaProdutos, RodapeLoja, contactoWhatsApp } from "./comum";

/** Barra de aviso preta e cabeçalho com o nome em letra de revista, ao centro. */
export function TopoBoutique({ loja, voltar }: { loja: Loja; voltar?: boolean }) {
  return (
    <header className="bg-fundo">
      {loja.aviso && <p className="bg-[#111] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-widest text-white">{loja.aviso}</p>}
      <div className="mx-auto grid max-w-6xl grid-cols-[48px_1fr_48px] items-center px-4 py-5">
        {voltar ? (
          <Link href={`/${loja.slug}`} aria-label="Voltar à loja" className="p-1 text-ink"><ArrowLeft className="size-5" /></Link>
        ) : <span />}
        <Link href={`/${loja.slug}`} className="text-center">
          <span className="letra-revista block text-3xl uppercase md:text-4xl">{loja.nome}</span>
          {loja.cidade && <span className="mt-1 block text-[10px] uppercase tracking-[0.35em] text-mute">{loja.cidade}</span>}
        </Link>
        <a href={contactoWhatsApp(loja)} target="_blank" rel="noopener" aria-label={`Falar com ${loja.nome} no WhatsApp`} className="justify-self-end p-1 text-ink hover:text-[var(--destaque)]">
          <WhatsappLogo className="size-6" />
        </a>
      </div>
    </header>
  );
}

export function MontraBoutique({ loja, categoria }: { loja: Loja; categoria?: string }) {
  const titulo = loja.bannerTitulo || loja.nome;
  const texto = loja.bannerTexto || loja.descricao;
  return (
    <>
      <TopoBoutique loja={loja} />
      <div className="border-y border-line px-4 py-3">
        <FiltroCategorias loja={loja} activa={categoria} variante="boutique" />
      </div>
      <main id="conteudo">
        <section className="relative">
          {loja.banner ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={loja.banner} alt="" className="aspect-[4/5] w-full object-cover sm:aspect-[21/8]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/35 px-6 text-center">
                <h1 className="letra-revista max-w-3xl text-4xl leading-tight text-[#111] md:text-6xl">{titulo}</h1>
                {texto && <p className="mt-3 max-w-xl text-sm text-[#222] md:text-base">{texto}</p>}
                <a href="#produtos" className="mt-6 bg-[#111] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-85">Ver colecção</a>
              </div>
            </>
          ) : (
            <div className="bg-superficie px-6 py-16 text-center md:py-24">
              <h1 className="letra-revista mx-auto max-w-3xl text-4xl leading-tight md:text-6xl">{titulo}</h1>
              {texto && <p className="mx-auto mt-4 max-w-xl text-sm text-mute md:text-base">{texto}</p>}
            </div>
          )}
        </section>

        <div className="border-b border-line bg-superficie/60">
          <div className="mx-auto max-w-6xl px-4 py-6"><Garantias loja={loja} variante="boutique" /></div>
        </div>

        <section id="produtos" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-14">
          <h2 className="letra-revista text-center text-3xl md:text-4xl">{categoria ?? "A nossa colecção"}</h2>
          <div className="mt-10"><GrelhaProdutos loja={loja} categoria={categoria} variante="boutique" /></div>
        </section>
      </main>
      <RodapeLoja loja={loja} />
    </>
  );
}
