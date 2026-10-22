import Link from "next/link";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { ProdutosRotativos } from "./ProdutosRotativos";

/** Os anéis de linhas atrás do produto: elipses com rotação a crescer, em degradê de azul. */
function Aneis() {
  const n = 34;
  return (
    <svg viewBox="-300 -300 600 600" className="aneis absolute inset-0 m-auto h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="aneis-cor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7FA6F5" />
          <stop offset="55%" stopColor="#1558D6" />
          <stop offset="100%" stopColor="#0B2F73" />
        </linearGradient>
      </defs>
      {Array.from({ length: n }, (_, i) => (
        <ellipse
          key={i}
          rx={250 - i * 1.2}
          ry={120 + i * 1.6}
          fill="none"
          stroke="url(#aneis-cor)"
          strokeWidth="1"
          strokeOpacity={0.35 + (i / n) * 0.5}
          transform={`rotate(${-35 + i * 2.2})`}
        />
      ))}
    </svg>
  );
}

export function HeroEscuro() {
  return (
    <section id="topo" className="hero-escuro relative overflow-hidden text-white">
      <div className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-4 pb-28 pt-28 md:grid-cols-[1fr_1.15fr] md:pb-24 md:pt-24">
        <div className="relative z-10">
          <h1 className="text-6xl font-bold leading-none md:text-7xl">VITRYNE</h1>
          <p className="mt-2 text-4xl font-semibold leading-tight text-[#7FA6F5] md:text-5xl">A tua loja online</p>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em]">Vende pelo WhatsApp</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
            Uma montra com o teu nome para o que vendes: roupa, perfumes, electrónica, comida e muito mais. O cliente escolhe, e o pedido chega ao teu WhatsApp já escrito, com o produto, o preço e o link.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <p className="leading-none">
              <span className="block text-4xl font-bold">0 Kz</span>
              <span className="mt-1 block text-xs text-white/60">no primeiro mês</span>
            </p>
            <Link
              href="/registo"
              className="rounded-md bg-brand px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-[0_12px_32px_rgba(21,88,214,0.45)] transition-colors duration-300 ease-fluid hover:bg-[#2A6BE6] active:scale-[0.98]"
            >
              Criar a minha loja
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <Aneis />
          <ProdutosRotativos />
        </div>
      </div>

      <Link
        href="/kianda-style"
        className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-max items-center gap-3 text-left text-xs font-bold uppercase leading-4 tracking-[0.15em] text-white/80 transition-colors duration-300 hover:text-white"
      >
        <span className="flex size-9 items-center justify-center rounded-full border border-white/60">
          <Play className="size-4" weight="fill" />
        </span>
        <span>Ver<br />loja de exemplo</span>
      </Link>
    </section>
  );
}
