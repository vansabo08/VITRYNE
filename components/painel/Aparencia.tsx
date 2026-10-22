"use client";

import { Check, ImageSquare, X } from "@phosphor-icons/react";
import type { Tema } from "@/lib/types";

const campo = "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition-colors duration-300 placeholder:text-mute focus:border-realce";

const ESTILOS: { id: Tema; nome: string; descricao: string }[] = [
  { id: "vitryne", nome: "VITRYNE", descricao: "Escuro e vidro, foco total no produto" },
  { id: "boutique", nome: "Boutique", descricao: "Claro e elegante, com banner grande" },
  { id: "moderno", nome: "Moderno", descricao: "Limpo, com categorias em círculos" },
];

/** Miniatura esquemática de cada estilo, para o vendedor escolher sem sair do painel. */
function Miniatura({ id, cor, nome }: { id: Tema; cor: string; nome: string }) {
  const n = nome || "Loja";
  if (id === "vitryne") {
    return (
      <div className="flex h-full flex-col gap-1.5 bg-[#070D1A] p-2" style={{ backgroundImage: `radial-gradient(60% 50% at 70% 20%, ${cor}66, transparent)` }}>
        <span className="h-1.5 w-8 rounded-full bg-white/30" />
        <span className="mt-1 text-[11px] font-bold leading-none text-white">{n}</span>
        <div className="mt-auto grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => <span key={i} className="aspect-[4/5] rounded-sm border border-white/10 bg-white/10" />)}
        </div>
      </div>
    );
  }
  if (id === "boutique") {
    return (
      <div className="flex h-full flex-col bg-[#F2F0ED]">
        <span className="h-1.5 bg-black" />
        <span className="mt-1.5 text-center font-serif text-[11px] leading-none text-black">{n}</span>
        <span className="mx-2 mt-1.5 h-6 rounded-sm bg-[#D9D4CC]" />
        <div className="mx-2 mt-auto mb-2 grid grid-cols-4 gap-0.5">
          {[0, 1, 2, 3].map((i) => <span key={i} className="aspect-[3/4] bg-[#CFC8BE]" />)}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col bg-white p-1.5">
      <span className="text-[10px] font-bold leading-none" style={{ color: cor }}>{n}</span>
      <span className="mt-1 h-6 rounded" style={{ backgroundColor: `${cor}33` }} />
      <div className="mt-1.5 flex justify-center gap-1">
        {[0, 1, 2, 3].map((i) => <span key={i} className="size-3 rounded-full bg-[#E5E5E5]" />)}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-1">
        {[0, 1, 2].map((i) => <span key={i} className="aspect-[4/5] rounded-sm border border-[#E5E5E5]" />)}
      </div>
    </div>
  );
}

export function Aparencia(p: {
  tema: Tema; setTema: (t: Tema) => void; cor: string; nome: string;
  banner: string | null; setBanner: (b: string | null) => void; escolherBanner: (e: React.ChangeEvent<HTMLInputElement>) => void; aEnviar: boolean;
  bannerTitulo: string; setBannerTitulo: (v: string) => void;
  bannerTexto: string; setBannerTexto: (v: string) => void;
  aviso: string; setAviso: (v: string) => void;
}) {
  return (
    <section className="vidro rounded-2xl p-5 md:p-6">
      <h2 className="etiqueta text-mute">Aparência da loja</h2>
      <div role="radiogroup" aria-label="Estilo da loja" className="mt-4 grid grid-cols-3 gap-3">
        {ESTILOS.map((e) => {
          const activo = p.tema === e.id;
          return (
            <button
              key={e.id}
              type="button"
              role="radio"
              aria-checked={activo}
              aria-label={`${e.nome}: ${e.descricao}`}
              onClick={() => p.setTema(e.id)}
              className="group text-left transition-transform active:scale-[0.98]"
            >
              <div className={`relative aspect-[3/4] overflow-hidden rounded-xl ring-2 transition-all ${activo ? "ring-realce" : "ring-white/10 group-hover:ring-white/30"}`}>
                <Miniatura id={e.id} cor={p.cor} nome={p.nome} />
                {activo && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-brand p-1 text-white">
                    <Check className="size-3" weight="bold" />
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold">{e.nome}</p>
              <p className="hidden text-xs text-mute sm:block">{e.descricao}</p>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm font-semibold">Imagem do banner</p>
      <p className="text-xs text-mute">Aparece no topo da loja. Uma foto na horizontal dos teus produtos ou da tua loja.</p>
      {p.banner ? (
        <div className="relative mt-3 overflow-hidden rounded-xl ring-1 ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.banner} alt="Banner da loja" className="aspect-[21/9] w-full object-cover" />
          <button type="button" aria-label="Remover banner" onClick={() => p.setBanner(null)} className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white backdrop-blur hover:bg-red-600">
            <X className="size-4" weight="bold" />
          </button>
        </div>
      ) : (
        <label className="mt-3 flex aspect-[21/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 text-center transition-colors hover:border-realce hover:bg-white/5">
          <ImageSquare className="size-7 text-realce" weight="duotone" />
          <span className="text-xs font-semibold">{p.aEnviar ? "A enviar…" : "Escolher imagem"}</span>
          <input type="file" accept="image/*" disabled={p.aEnviar} onChange={p.escolherBanner} className="sr-only" />
        </label>
      )}

      <label className="mt-4 block text-sm font-semibold">Título do banner
        <input value={p.bannerTitulo} maxLength={80} onChange={(e) => p.setBannerTitulo(e.target.value)} placeholder="Ex.: Nova colecção chegou" className={campo} />
      </label>
      <label className="mt-4 block text-sm font-semibold">Texto do banner
        <input value={p.bannerTexto} maxLength={160} onChange={(e) => p.setBannerTexto(e.target.value)} placeholder="Ex.: Vestidos de capulana feitos em Luanda" className={campo} />
      </label>
      <label className="mt-4 block text-sm font-semibold">Aviso no topo da loja
        <input value={p.aviso} maxLength={120} onChange={(e) => p.setAviso(e.target.value)} placeholder="Ex.: Entregas em Luanda em 24 horas" className={campo} />
        <span className="mt-1 block text-xs font-normal text-mute">Usado nos estilos Boutique e Moderno. Deixa vazio para não mostrar.</span>
      </label>
    </section>
  );
}
