import Link from "next/link";
import { ArrowLeft, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { Loja } from "@/lib/types";
import { ProductImage } from "@/components/ProductImage";
import { CartaoProduto, FiltroCategorias, Garantias, GrelhaProdutos, RodapeLoja, categoriasDe, contactoWhatsApp, produtosVisiveis } from "./comum";

/** Cabeçalho limpo: nome à esquerda na cor da loja, categorias ao centro, WhatsApp à direita. */
export function TopoModerno({ loja, voltar }: { loja: Loja; voltar?: boolean }) {
  const cats = categoriasDe(loja).slice(0, 5);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-fundo/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-2">
          {voltar && <Link href={`/${loja.slug}`} aria-label="Voltar à loja" className="p-1"><ArrowLeft className="size-5" /></Link>}
          <Link href={`/${loja.slug}`} className="text-xl font-bold leading-none" style={{ color: loja.destaque }}>{loja.nome}</Link>
        </div>
        <nav aria-label="Categorias" className="hidden gap-6 md:flex">
          {cats.map((c) => (
            <Link key={c} href={`/${loja.slug}?categoria=${encodeURIComponent(c)}#produtos`} className="text-xs font-semibold uppercase tracking-wider text-mute hover:text-ink">{c}</Link>
          ))}
        </nav>
        <a href={contactoWhatsApp(loja)} target="_blank" rel="noopener" aria-label={`Falar com ${loja.nome} no WhatsApp`} className="rounded-full p-2 text-ink hover:bg-superficie">
          <WhatsappLogo className="size-6" />
        </a>
      </div>
    </header>
  );
}

export function MontraModerno({ loja, categoria }: { loja: Loja; categoria?: string }) {
  const titulo = loja.bannerTitulo || loja.nome;
  const texto = loja.bannerTexto || loja.descricao;
  const cats = categoriasDe(loja);
  const capaDe = (c: string) => produtosVisiveis(loja, c)[0];
  const novidades = produtosVisiveis(loja).slice(0, 8);

  return (
    <>
      {loja.aviso && <p className="px-4 py-2 text-center text-xs font-semibold text-white" style={{ backgroundColor: loja.destaque }}>{loja.aviso}</p>}
      <TopoModerno loja={loja} />
      <main id="conteudo" className="mx-auto max-w-6xl px-4">
        <section className="mt-4 grid overflow-hidden rounded-lg bg-superficie md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center p-8 md:order-1 md:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-mute">{loja.cidade ? `${loja.nome}, ${loja.cidade}` : loja.nome}</p>
            <h1 className="mt-3 text-3xl font-bold uppercase leading-tight md:text-4xl">{titulo}</h1>
            {texto && <p className="mt-3 text-sm text-mute">{texto}</p>}
            <a href="#produtos" className="mt-6 w-max rounded-full px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110" style={{ backgroundColor: loja.destaque }}>
              Ver produtos
            </a>
          </div>
          <div className="order-1 md:order-2">
            {loja.banner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={loja.banner} alt="" className="aspect-[4/3] h-full w-full object-cover" />
            ) : novidades[0] ? (
              <ProductImage src={novidades[0].fotos[0]} tipo={novidades[0].tipo} alt={novidades[0].nome} priority sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] h-full w-full" />
            ) : null}
          </div>
        </section>

        <div className="py-10"><Garantias loja={loja} variante="moderno" /></div>

        {cats.length > 1 && (
          <section className="rounded-lg bg-superficie px-4 py-8">
            <h2 className="text-center text-lg font-semibold">Categorias</h2>
            <ul className="mt-6 flex justify-start gap-6 overflow-x-auto pb-2 md:justify-center">
              {cats.map((c) => {
                const capa = capaDe(c);
                return (
                  <li key={c} className="shrink-0">
                    <Link href={`/${loja.slug}?categoria=${encodeURIComponent(c)}#produtos`} className="group flex w-20 flex-col items-center gap-2 text-center md:w-24">
                      <span className={`block size-20 overflow-hidden rounded-full ring-2 transition-all md:size-24 ${categoria === c ? "ring-[var(--destaque)]" : "ring-transparent group-hover:ring-line"}`}>
                        {capa && <ProductImage src={capa.fotos[0]} tipo={capa.tipo} alt="" sizes="96px" className="size-full" />}
                      </span>
                      <span className="text-xs font-medium">{c}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {!categoria && novidades.length > 2 && (
          <section className="mt-12">
            <h2 className="text-center text-xl font-semibold">Novidades</h2>
            <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3">
              {novidades.map((p) => (
                <li key={p.id} className="w-44 shrink-0 snap-start md:w-56">
                  <CartaoProduto loja={loja} produto={p} variante="moderno" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="produtos" className="mt-12 scroll-mt-24">
          <h2 className="text-center text-xl font-semibold">{categoria ?? "Todos os produtos"}</h2>
          <div className="mt-5"><FiltroCategorias loja={loja} activa={categoria} variante="moderno" /></div>
          <div className="mt-6"><GrelhaProdutos loja={loja} categoria={categoria} variante="moderno" /></div>
        </section>
      </main>
      <RodapeLoja loja={loja} />
    </>
  );
}
