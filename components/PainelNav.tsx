"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Package, ChatCircleDots, Storefront, Crown, SignOut, ArrowSquareOut, Plus } from "@phosphor-icons/react";
import { terminarSessao } from "@/app/painel/actions";
import { Logo } from "./Logo";

const itens = [
  { href: "/painel", label: "Início", Icon: House },
  { href: "/painel/produtos", label: "Produtos", Icon: Package },
  { href: "/painel/pedidos", label: "Pedidos", Icon: ChatCircleDots },
  { href: "/painel/loja", label: "Loja", Icon: Storefront },
  { href: "/painel/plano", label: "Plano", Icon: Crown },
];

export type LojaResumo = { nome: string; slug: string; logotipo: string | null; destaque: string; plano: string } | null;

function Avatar({ loja, className }: { loja: NonNullable<LojaResumo>; className: string }) {
  return loja.logotipo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={loja.logotipo} alt="" className={`${className} rounded-xl object-cover`} />
  ) : (
    <span className={`${className} flex items-center justify-center rounded-xl text-base font-bold text-white`} style={{ backgroundColor: loja.destaque }} aria-hidden="true">
      {loja.nome.charAt(0)}
    </span>
  );
}

export function PainelNav({ loja }: { loja: LojaResumo }) {
  const path = usePathname();
  const activo = (href: string) => (href === "/painel" ? path === href : path.startsWith(href));

  return (
    <>
      {/* Telemóvel: barra de vidro no topo */}
      <header className="vidro fixed inset-x-0 top-0 z-30 flex items-center justify-between rounded-none border-x-0 border-t-0 px-4 py-3 md:hidden">
        {loja ? (
          <Link href={`/${loja.slug}`} className="flex min-w-0 items-center gap-3">
            <Avatar loja={loja} className="size-9 shrink-0" />
            <span className="truncate text-base font-bold">{loja.nome}</span>
          </Link>
        ) : (
          <Logo />
        )}
        <form action={terminarSessao}>
          <button aria-label="Sair" className="rounded-lg p-2 text-mute transition-colors hover:text-ink active:scale-95">
            <SignOut className="size-5" />
          </button>
        </form>
      </header>

      {/* Telemóvel: barra de vidro em baixo */}
      <nav aria-label="Painel" className="vidro fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl md:hidden">
        {itens.map(({ href, label, Icon }) => (
          <Link
            key={href} href={href} aria-current={activo(href) ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors ${activo(href) ? "text-realce" : "text-mute"}`}
          >
            <Icon className="size-6" weight={activo(href) ? "fill" : "regular"} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Computador: barra lateral de vidro */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 p-4 md:block">
        <div className="vidro flex h-full flex-col rounded-2xl p-4">
          <Link href="/" aria-label="VITRYNE, início" className="px-2"><Logo /></Link>

          {loja && (
            <div className="vidro-suave mt-6 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <Avatar loja={loja} className="size-10 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{loja.nome}</p>
                  <p className="etiqueta text-[10px] text-realce">Plano {loja.plano}</p>
                </div>
              </div>
              <a href={`/${loja.slug}`} target="_blank" rel="noopener" className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs font-semibold text-mute transition-colors hover:border-white/25 hover:text-ink">
                Ver loja <ArrowSquareOut className="size-4" />
              </a>
            </div>
          )}

          <nav aria-label="Painel" className="mt-6 space-y-1">
            {itens.map(({ href, label, Icon }) => (
              <Link
                key={href} href={href} aria-current={activo(href) ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ease-fluid ${
                  activo(href)
                    ? "bg-brand/20 text-ink shadow-[inset_0_0_0_1px_rgba(127,166,245,0.25)]"
                    : "text-mute hover:bg-white/5 hover:text-ink"
                }`}
              >
                <Icon className={`size-5 ${activo(href) ? "text-realce" : ""}`} weight={activo(href) ? "fill" : "regular"} />
                {label}
              </Link>
            ))}
          </nav>

          {loja && (
            <Link href="/painel/produtos/novo" className="btn mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-white shadow-[0_12px_32px_rgba(21,88,214,0.4)] transition-colors hover:bg-[#2A6BE6]">
              <Plus className="size-4" weight="bold" /> Novo produto
            </Link>
          )}

          <form action={terminarSessao} className="mt-auto">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-mute transition-colors hover:bg-white/5 hover:text-ink">
              <SignOut className="size-5" /> Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
