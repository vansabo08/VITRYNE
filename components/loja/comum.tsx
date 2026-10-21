import Link from "next/link";
import { ChatsCircle, HandCoins, Truck, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { Loja, Produto, Tema } from "@/lib/types";
import { formatKz } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";

/* Peças partilhadas pelos três estilos de loja. */

export function produtosVisiveis(loja: Loja, categoria?: string) {
  const activos = loja.produtos.filter((p) => p.activo);
  return categoria ? activos.filter((p) => p.categoria === categoria) : activos;
}

export function categoriasDe(loja: Loja) {
  return Array.from(new Set(loja.produtos.filter((p) => p.activo).map((p) => p.categoria).filter(Boolean)));
}

/** Link para falar com a loja no WhatsApp, sem produto (contacto geral). */
export function contactoWhatsApp(loja: Loja) {
  return `https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(`Olá! Vi a vossa loja ${loja.nome} na VITRYNE.`)}`;
}

export function AvatarLoja({ loja, className = "" }: { loja: Loja; className?: string }) {
  return loja.logotipo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={loja.logotipo} alt="" className={`${className} rounded-full bg-white object-cover`} />
  ) : (
    <span className={`${className} flex items-center justify-center rounded-full font-bold text-white`} style={{ backgroundColor: loja.destaque }} aria-hidden="true">
      {loja.nome.charAt(0)}
    </span>
  );
}

/** As quatro garantias, adaptadas a uma loja que vende pelo WhatsApp. */
export function Garantias({ loja, variante }: { loja: Loja; variante: Tema }) {
  const itens = [
    { Icon: WhatsappLogo, titulo: "Pedido pelo WhatsApp", texto: "Escolhes e a mensagem vai pronta" },
    { Icon: Truck, titulo: loja.cidade ? `Entregas em ${loja.cidade}` : "Entregas combinadas", texto: "Combinas a entrega na conversa" },
    { Icon: HandCoins, titulo: "Pagamento combinado", texto: "Pagas só depois de combinar" },
    { Icon: ChatsCircle, titulo: "Dúvidas?", texto: "Fala connosco a qualquer hora" },
  ];
  const redondo = variante === "moderno";
  return (
    <ul className={`grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 ${variante === "vitryne" ? "vidro rounded-2xl p-5" : ""}`}>
      {itens.map(({ Icon, titulo, texto }) => (
        <li key={titulo} className={`flex gap-3 ${redondo ? "flex-col items-center text-center" : "items-start"}`}>
          <span className={`flex shrink-0 items-center justify-center ${redondo ? "size-14 rounded-full ring-1 ring-[var(--destaque)]" : "size-9"}`}>
            <Icon className="size-6 text-realce" weight="light" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-wider">{titulo}</span>
            <span className="block text-xs text-mute">{texto}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Chips de categoria como links (?categoria=...), para a grelha ser desenhada no servidor. */
export function FiltroCategorias({ loja, activa, variante }: { loja: Loja; activa?: string; variante: Tema }) {
  const cats = categoriasDe(loja);
  if (cats.length < 2) return null;
  const base = `/${loja.slug}`;
  const chip = (activo: boolean) =>
    variante === "boutique"
      ? `shrink-0 border-b-2 px-1 pb-1 text-xs font-semibold uppercase tracking-wider ${activo ? "border-ink" : "border-transparent text-mute hover:text-ink"}`
      : `shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
          activo ? "bg-brand text-white" : variante === "vitryne" ? "vidro-suave text-mute hover:text-ink" : "bg-superficie text-ink hover:bg-line"
        }`;
  return (
    <nav aria-label="Categorias" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:justify-center">
      <Link href={`${base}#produtos`} className={chip(!activa)} aria-current={!activa ? "page" : undefined}>Tudo</Link>
      {cats.map((c) => (
        <Link key={c} href={`${base}?categoria=${encodeURIComponent(c)}#produtos`} className={chip(activa === c)} aria-current={activa === c ? "page" : undefined}>
          {c}
        </Link>
      ))}
    </nav>
  );
}

/** Cartão de produto, com uma variação visual por estilo. */
export function CartaoProduto({ loja, produto: p, variante, prioridade = false }: { loja: Loja; produto: Produto; variante: Tema; prioridade?: boolean }) {
  const href = `/${loja.slug}/${p.slug}`;
  const cores = (
    <span className="flex gap-1">
      {p.cores.slice(0, 5).map((c) => (
        <span key={c.nome} title={c.nome} className="size-3 rounded-full ring-1 ring-black/15" style={{ backgroundColor: c.hex }} />
      ))}
    </span>
  );

  if (variante === "boutique") {
    return (
      <article className="group">
        <Link href={href} className="block overflow-hidden bg-superficie">
          <ProductImage src={p.fotos[0]} tipo={p.tipo} alt={p.nome} priority={prioridade} className="aspect-[3/4] w-full transition-transform duration-700 ease-fluid group-hover:scale-[1.03]" />
        </Link>
        <div className="mt-3 space-y-1.5">
          {cores}
          <h3 className="text-xs font-medium uppercase tracking-wider">{p.nome}</h3>
          <p className="text-sm font-bold">{formatKz(p.preco)}</p>
          <Link href={href} className="inline-block bg-ink px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-fundo transition-opacity hover:opacity-85">
            Pedir
          </Link>
        </div>
      </article>
    );
  }

  if (variante === "moderno") {
    return (
      <Link href={href} className="group block overflow-hidden rounded-xl border border-line bg-fundo transition-shadow hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <ProductImage src={p.fotos[0]} tipo={p.tipo} alt={p.nome} priority={prioridade} className="aspect-[4/5] w-full transition-transform duration-700 ease-fluid group-hover:scale-[1.03]" />
        <div className="p-3 text-center">
          <h3 className="truncate text-sm font-semibold">{p.nome}</h3>
          <p className="truncate text-xs text-mute">{p.cores.map((c) => c.nome).slice(0, 2).join(", ")}</p>
          <p className="mt-1 text-sm font-bold">{formatKz(p.preco)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="vidro group block overflow-hidden rounded-2xl">
      <ProductImage src={p.fotos[0]} tipo={p.tipo} alt={p.nome} priority={prioridade} className="aspect-[4/5] w-full transition-transform duration-700 ease-fluid group-hover:scale-[1.03]" />
      <div className="p-3 md:p-4">
        <h3 className="truncate text-sm font-semibold text-mute group-hover:text-ink">{p.nome}</h3>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-base font-bold">{formatKz(p.preco)}</p>
          {cores}
        </div>
      </div>
    </Link>
  );
}

export function GrelhaProdutos({ loja, categoria, variante }: { loja: Loja; categoria?: string; variante: Tema }) {
  const lista = produtosVisiveis(loja, categoria);
  if (lista.length === 0) {
    return <p className="rounded-2xl bg-superficie p-8 text-center text-sm text-mute">Ainda não há produtos nesta categoria.</p>;
  }
  const colunas = variante === "boutique" ? "grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4" : "grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4";
  return (
    <ul className={`grid ${colunas}`}>
      {lista.map((p, i) => (
        <li key={p.id}>
          <CartaoProduto loja={loja} produto={p} variante={variante} prioridade={i < 2} />
        </li>
      ))}
    </ul>
  );
}

export function RodapeLoja({ loja }: { loja: Loja }) {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <AvatarLoja loja={loja} className="size-9 text-sm" />
          <div>
            <p className="text-sm font-bold">{loja.nome}</p>
            {loja.cidade && <p className="text-xs text-mute">{loja.cidade}</p>}
          </div>
        </div>
        <a href={contactoWhatsApp(loja)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2 text-xs font-semibold text-white hover:brightness-110">
          <WhatsappLogo className="size-4" weight="fill" /> Falar com a loja
        </a>
        <Link href="/" className="text-xs text-mute hover:text-ink">Loja criada com VITRYNE</Link>
      </div>
    </footer>
  );
}
