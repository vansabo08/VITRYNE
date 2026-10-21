"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "#montra", label: "Ver uma loja" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#planos", label: "Planos" },
  { href: "#perguntas", label: "Perguntas" },
];

export function LandingNav() {
  const [aberto, setAberto] = useState(false);
  // Transparente com texto branco enquanto o hero escuro está por baixo do menu.
  const [sobreHero, setSobreHero] = useState(true);
  const escuro = sobreHero && !aberto;
  const linha = `absolute left-0 h-0.5 w-6 rounded transition-all duration-500 ease-fluid ${escuro ? "bg-white" : "bg-ink"}`;

  useEffect(() => {
    const hero = document.getElementById("topo");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setSobreHero(e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Fecha o menu com Escape e trava o scroll da página enquanto está aberto.
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [aberto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ease-fluid ${
        escuro ? "bg-transparent text-white" : "border-b border-line/60 bg-fundo/90 text-ink backdrop-blur-md"
      }`}
    >
      <nav aria-label="Principal" className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" aria-label="VITRYNE, início" className="relative z-50"><Logo tone={escuro ? "white" : "brand"} /></Link>

        <ul className="hidden items-center gap-10 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${escuro ? "text-white/85 hover:text-white" : "text-mute hover:text-ink"}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/entrar" className="text-xs font-bold uppercase tracking-[0.15em] hover:opacity-80">Entrar</Link>
          {!escuro && (
            <Link href="/registo" className="rounded-md bg-brand px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-brand-deep">
              Criar loja
            </Link>
          )}
        </div>

        <button
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          onClick={() => setAberto(!aberto)}
          className="relative z-50 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] lg:hidden"
        >
          Menu
          <span className="relative block h-4 w-6">
            <span className={`${linha} top-0 ${aberto ? "top-2 rotate-45" : ""}`} />
            <span className={`${linha} top-2 ${aberto ? "opacity-0" : ""}`} />
            <span className={`${linha} top-4 ${aberto ? "top-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-fundo px-8 text-ink transition-all duration-500 ease-fluid lg:hidden ${
          aberto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {[...links, { href: "/entrar", label: "Entrar" }].map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setAberto(false)}
            style={{ transitionDelay: aberto ? `${80 + i * 50}ms` : "0ms" }}
            className={`text-3xl font-bold transition-all duration-500 ease-fluid ${aberto ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            {l.label}
          </a>
        ))}
        <Link
          href="/registo"
          onClick={() => setAberto(false)}
          className="mt-4 btn rounded-md bg-brand px-6 py-3 text-center text-white"
        >
          Criar a minha loja
        </Link>
      </div>
    </header>
  );
}
