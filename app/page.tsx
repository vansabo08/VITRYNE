import Image from "next/image";
import Link from "next/link";
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";
import { LandingNav } from "@/components/LandingNav";
import { Logo } from "@/components/Logo";
import { TaglineReveal } from "@/components/TaglineReveal";
import { MensagemWhatsApp, MontraNoTelemovel } from "@/components/landing/Maquetes";
import { HeroEscuro } from "@/components/landing/Hero";
import vendedorArara from "@/assets/vendedor-arara.webp";
import vestidoVermelho from "@/assets/vestido-vermelho.webp";

const botao =
  "btn inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-white shadow-[0_12px_32px_rgba(21,88,214,0.4)] transition-colors duration-300 ease-fluid hover:bg-[#2A6BE6] active:scale-[0.98]";

/** Título no estilo do hero: primeira parte a branco, segunda em azul claro, etiqueta em maiúsculas por baixo. */
function Titulo({ primeira, segunda, etiqueta }: { primeira: string; segunda: string; etiqueta?: string }) {
  return (
    <>
      <h2 className="max-w-[640px] text-4xl font-bold leading-tight md:text-5xl">
        {primeira}
        <span className="block font-semibold text-realce">{segunda}</span>
      </h2>
      {etiqueta && <p className="etiqueta mt-6">{etiqueta}</p>}
    </>
  );
}

const passos = [
  { titulo: "Cria a loja", texto: "Escreves o nome, escolhes o link e pões o teu número de WhatsApp. Leva menos de cinco minutos." },
  { titulo: "Carrega os produtos", texto: "Tiras as fotos com o telemóvel, pões o preço, os tamanhos e as cores. As fotos ficam leves sozinhas." },
  { titulo: "Partilha o link", texto: "No estado do WhatsApp, no Instagram ou num QR code colado na banca. Os pedidos chegam-te já escritos." },
];

const planos = [
  { nome: "Grátis", preco: "0 Kz", nota: "no primeiro mês", itens: ["Até 10 produtos", "Link e QR code", "Pedidos no WhatsApp"] },
  { nome: "Básico", preco: "5.000 Kz", nota: "por mês", itens: ["Até 50 produtos", "Link e QR code", "Lista de pedidos"] },
  { nome: "Pro", preco: "10.000 Kz", nota: "por mês", itens: ["Produtos sem limite", "Estatísticas de visitas", "Lista de pedidos"] },
];

const perguntas = [
  ["Preciso de pagar para começar?", "Não. O primeiro mês é grátis, com até 10 produtos, e não pedimos cartão."],
  ["Os clientes pagam no site?", "Não. O cliente pede no WhatsApp e tu combinas o pagamento e a entrega na conversa, como já fazes hoje."],
  ["A minha loja aparece ao lado de outras?", "Não. Cada vendedor tem o seu link e o cliente só vê os teus produtos."],
  ["Funciona com dados móveis fracos?", "Sim. As fotos são comprimidas e as páginas são pequenas, para abrirem bem em 3G."],
  ["Que tamanhos posso usar?", "Calçado do 36 ao 46 e roupa em P, M, G e GG. As cores escolhes tu, produto a produto."],
  ["Como pago o Básico ou o Pro?", "Falas connosco e activamos o plano à mão depois do pagamento."],
];

export default function Home() {
  return (
    <>
      <LandingNav />
      <main id="conteudo">
        <HeroEscuro />

        {/* A montra real */}
        <section id="montra" className="brilho-esq scroll-mt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-[1fr_1.1fr] md:py-28">
            <div className="md:order-2">
              <Titulo primeira="A tua loja," segunda="vista pelo cliente" etiqueta="Kianda Style, a loja de exemplo" />
              <p className="mt-3 max-w-[480px] text-base leading-7 text-mute">
                O nome e a cor da loja no topo, os produtos com foto e preço, e mais nada a distrair. Não há outras lojas à volta, só a tua.
              </p>
              <Link href="/kianda-style" className={`${botao} mt-10`}>Abrir a loja de exemplo</Link>
            </div>
            <MontraNoTelemovel />
          </div>
        </section>

        {/* O pedido no WhatsApp */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="relative">
            <Image
              src={vendedorArara}
              alt="Vendedor de roupa ao lado de uma arara com camisas estampadas"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/5] h-auto w-full rounded-2xl object-cover"
            />
            <MensagemWhatsApp className="absolute -bottom-8 right-4 w-[78%] max-w-[300px] md:-right-8" />
          </div>
          <div className="pt-8 md:pt-0">
            <Titulo primeira="O pedido chega" segunda="já escrito" etiqueta="Produto, tamanho, cor, preço e link" />
            <p className="mt-3 max-w-[480px] text-base leading-7 text-mute">
              Acabou o «tem no 41?» e o «quanto custa?» repetido dez vezes por dia. Tu só confirmas e combinas a entrega.
            </p>
            <p className="mt-4 max-w-[480px] text-base leading-7 text-mute">
              Mesmo quando o cliente desiste antes de enviar, o clique fica registado no teu painel. Sabes que produtos estão a chamar atenção.
            </p>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="brilho-dir scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
            <Titulo primeira="Três passos" segunda="até ao primeiro pedido" />
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {passos.map((p, i) => (
                <li key={p.titulo} className="border-t border-line pt-6">
                  <span className="text-5xl font-bold text-realce">{String(i + 1).padStart(2, "0")}</span>
                  <p className="etiqueta mt-4">{p.titulo}</p>
                  <p className="mt-3 text-base leading-7 text-mute">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Slogan */}
        <section className="px-4 py-20 text-center md:py-28" aria-label="Slogan">
          <TaglineReveal lines={["A tua loja.", "O teu mundo."]} />
        </section>

        {/* Planos */}
        <section id="planos" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 md:py-28">
          <Titulo primeira="Começa grátis," segunda="paga quando crescer" />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {planos.map((pl) => {
              const pro = pl.nome === "Pro";
              return (
                <div
                  key={pl.nome}
                  className={`rounded-2xl border p-8 ${pro ? "border-brand bg-brand-deep/40 shadow-[0_24px_60px_rgba(21,88,214,0.25)]" : "border-line bg-superficie"}`}
                >
                  <p className="etiqueta text-realce">{pl.nome}</p>
                  <p className="mt-6 text-4xl font-bold">{pl.preco}</p>
                  <p className="mt-1 text-sm text-mute">{pl.nota}</p>
                  <ul className="mt-8 space-y-3">
                    {pl.itens.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-realce" weight="bold" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Perguntas */}
        <section id="perguntas" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-20 md:py-28">
          <Titulo primeira="Perguntas" segunda="frequentes" />
          <div className="mt-10 border-t border-line">
            {perguntas.map(([q, a]) => (
              <details key={q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-semibold">
                  {q}
                  <CaretDown className="size-5 shrink-0 text-realce transition-transform duration-300 ease-fluid group-open:rotate-180" weight="bold" />
                </summary>
                <p className="pb-5 text-base leading-7 text-mute">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Chamada final */}
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid overflow-hidden rounded-2xl border border-line bg-superficie md:grid-cols-2">
            <Image
              src={vestidoVermelho}
              alt="Mulher de vestido vermelho numa escadaria"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/3] h-auto w-full object-cover md:aspect-auto md:h-full"
            />
            <div className="hero-escuro flex flex-col justify-center p-8 md:p-12">
              <Titulo primeira="Abre a tua loja" segunda="esta semana" etiqueta="Primeiro mês grátis, sem cartão" />
              <p className="mt-3 text-base leading-7 text-mute">Se não for para ti, não pagas nada.</p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <p className="leading-none">
                  <span className="block text-4xl font-bold">0 Kz</span>
                  <span className="mt-1 block text-xs text-mute">no primeiro mês</span>
                </p>
                <Link href="/registo" className={botao}>Criar a minha loja</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-mute">Lojas online para quem vende roupa e calçado em Angola.</p>
          </div>
          <ul className="flex flex-wrap gap-6">
            <li><Link href="/kianda-style" className="etiqueta text-mute hover:text-ink">Loja de exemplo</Link></li>
            <li><Link href="/entrar" className="etiqueta text-mute hover:text-ink">Entrar</Link></li>
            <li><Link href="/privacidade" className="etiqueta text-mute hover:text-ink">Privacidade</Link></li>
            <li><Link href="/termos" className="etiqueta text-mute hover:text-ink">Termos</Link></li>
          </ul>
        </div>
        <p className="border-t border-line py-6 text-center text-xs text-mute">© 2026 VITRYNE</p>
      </footer>
    </>
  );
}
