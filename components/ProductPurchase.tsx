"use client";

import { useRef, useState } from "react";
import { Check, Ruler, ShareNetwork, WhatsappLogo, X } from "@phosphor-icons/react";
import type { Loja, Produto } from "@/lib/types";
import { formatKz } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { registarClique } from "@/lib/track";
import { ProductImage } from "./ProductImage";

/* Medidas aproximadas (tabela europeia comum). A loja confirma na conversa. */
const PE_CM: Record<string, string> = {
  "36": "23,0", "37": "23,7", "38": "24,3", "39": "25,0", "40": "25,7", "41": "26,3",
  "42": "27,0", "43": "27,7", "44": "28,3", "45": "29,0", "46": "29,7",
};
const ROUPA_CM: Record<string, [string, string]> = {
  P: ["84 a 88", "66 a 70"], M: ["90 a 94", "72 a 76"], G: ["96 a 100", "78 a 82"], GG: ["102 a 108", "84 a 90"],
};

function GuiaTamanhos({ produto, fechar }: { produto: Produto; fechar: () => void }) {
  const calcado = produto.tipo === "calcado";
  return (
    <div role="dialog" aria-modal="true" aria-label="Guia de tamanhos" className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center" onClick={fechar}>
      <div className="w-full max-w-md rounded-2xl bg-fundo p-6 text-ink shadow-2xl ring-1 ring-line" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Guia de tamanhos</h2>
          <button onClick={fechar} aria-label="Fechar" className="rounded-lg p-1.5 text-mute hover:text-ink"><X className="size-5" /></button>
        </div>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-mute">
              <th className="py-2">Tamanho</th>
              {calcado ? <th className="py-2">Comprimento do pé</th> : <><th className="py-2">Busto</th><th className="py-2">Cintura</th></>}
            </tr>
          </thead>
          <tbody>
            {produto.tamanhos.map((t) => (
              <tr key={t} className="border-b border-line/60">
                <td className="py-2 font-bold">{t}</td>
                {calcado ? <td className="py-2">{PE_CM[t] ?? "?"} cm</td> : <><td className="py-2">{ROUPA_CM[t]?.[0] ?? "?"} cm</td><td className="py-2">{ROUPA_CM[t]?.[1] ?? "?"} cm</td></>}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-mute">
          {calcado ? "Mede o pé do calcanhar à ponta do dedo maior, de pé, ao fim do dia." : "Mede com uma fita à volta da parte mais larga do peito e da cintura."} São medidas aproximadas: confirma com a loja na conversa.
        </p>
      </div>
    </div>
  );
}

export function ProductPurchase({ loja, produto, url }: { loja: Loja; produto: Produto; url: string }) {
  const [foto, setFoto] = useState(0);
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [cor, setCor] = useState<string | null>(null);
  const [tentou, setTentou] = useState(false);
  const [guia, setGuia] = useState(false);
  const [partilhado, setPartilhado] = useState(false);
  const galeria = useRef<HTMLDivElement>(null);
  const revista = loja.tema === "boutique";

  const falta = !tamanho ? "Escolhe o tamanho" : !cor ? "Escolhe a cor" : null;
  const avisoTamanho = tentou && !tamanho;
  const avisoCor = tentou && !!tamanho && !cor;
  const fotos = produto.fotos.length ? produto.fotos : [undefined];

  function pedir() {
    if (falta || !tamanho || !cor) {
      setTentou(true);
      return;
    }
    // O clique fica registado mesmo que o cliente não chegue a enviar a mensagem.
    registarClique({ lojaId: loja.id, produtoId: produto.id, tamanho, cor });
    window.open(
      buildWhatsAppUrl(loja.whatsapp, { loja: loja.nome, produto: produto.nome, tamanho, cor, preco: produto.preco, url }),
      "_blank",
      "noopener",
    );
  }

  async function partilhar() {
    if (navigator.share) {
      await navigator.share({ title: produto.nome, text: `${produto.nome}, ${formatKz(produto.preco)}`, url }).catch(() => {});
    } else {
      await navigator.clipboard?.writeText(url);
      setPartilhado(true);
      setTimeout(() => setPartilhado(false), 2000);
    }
  }

  // No telemóvel a galeria desliza; o índice da foto visível acompanha o deslize.
  function aoDeslizar() {
    const el = galeria.current;
    if (el) setFoto(Math.round(el.scrollLeft / el.clientWidth));
  }
  function irPara(i: number) {
    setFoto(i);
    galeria.current?.scrollTo({ left: i * galeria.current.clientWidth, behavior: "smooth" });
  }

  const botao = (
    <button
      onClick={pedir}
      className={`btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-white transition-all duration-300 ease-fluid hover:brightness-110 active:scale-[0.98] ${falta ? "bg-wa/70" : "bg-wa shadow-[0_12px_32px_rgba(18,140,126,0.4)]"}`}
    >
      <WhatsappLogo className="size-5" weight="fill" />
      {falta ?? "Pedir no WhatsApp"}
    </button>
  );

  return (
    <div className="grid gap-8 pb-28 md:grid-cols-[1.1fr_1fr] md:gap-12 md:pb-0">
      {/* Galeria */}
      <div className="-mx-4 md:mx-0">
        <div className="relative">
          <div ref={galeria} onScroll={aoDeslizar} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:hidden">
            {fotos.map((src, i) => (
              <div key={i} className="w-full shrink-0 snap-center">
                <ProductImage src={src} tipo={produto.tipo} alt={`${produto.nome}, foto ${i + 1}`} priority={i === 0} sizes="100vw" className="aspect-[4/5] w-full" />
              </div>
            ))}
          </div>
          <div className="hidden overflow-hidden rounded-3xl bg-superficie md:block">
            <ProductImage src={fotos[foto]} tipo={produto.tipo} alt={produto.nome} priority sizes="55vw" className="aspect-[4/5] w-full" />
          </div>
          {fotos.length > 1 && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
              {fotos.map((_, i) => <span key={i} className={`h-1.5 rounded-full bg-white shadow transition-all ${i === foto ? "w-5" : "w-1.5 opacity-60"}`} />)}
            </div>
          )}
        </div>
        {fotos.length > 1 && (
          <div className="mt-3 hidden gap-2 md:flex">
            {fotos.map((src, i) => (
              <button
                key={i}
                onClick={() => irPara(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === foto}
                className={`shrink-0 overflow-hidden rounded-xl ring-2 transition-all duration-300 ease-fluid active:scale-95 ${i === foto ? "ring-[var(--destaque)]" : "ring-transparent opacity-60 hover:opacity-100"}`}
              >
                <ProductImage src={src} tipo={produto.tipo} alt={`${produto.nome}, foto ${i + 1}`} className="size-20" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Informação e escolha */}
      <div className="flex flex-col md:pt-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            {produto.categoria && <p className="text-xs font-semibold uppercase tracking-widest text-mute">{produto.categoria}</p>}
            <h1 className={`mt-2 leading-tight ${revista ? "letra-revista text-4xl" : "text-3xl font-bold md:text-4xl"}`}>{produto.nome}</h1>
          </div>
          <button onClick={partilhar} aria-label="Partilhar produto" className="shrink-0 rounded-full p-2.5 text-mute ring-1 ring-line transition-colors hover:text-ink">
            {partilhado ? <Check className="size-5" /> : <ShareNetwork className="size-5" />}
          </button>
        </div>
        <p className="mt-4 text-3xl font-bold">{formatKz(produto.preco)}</p>
        {produto.descricao && <p className="mt-5 text-base leading-7 text-mute">{produto.descricao}</p>}

        <fieldset className="mt-8">
          <div className="flex items-center justify-between">
            <legend className={`text-sm font-bold ${avisoTamanho ? "text-erro" : ""}`}>
              {avisoTamanho ? "Escolhe o tamanho" : "Tamanho"}
              {tamanho && <span className="font-medium text-mute"> {tamanho}</span>}
            </legend>
            <button type="button" onClick={() => setGuia(true)} className="flex items-center gap-1.5 text-xs font-semibold text-mute underline underline-offset-4 hover:text-ink">
              <Ruler className="size-4" /> Guia de tamanhos
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {produto.tamanhos.map((t) => (
              <button
                key={t}
                onClick={() => setTamanho(t)}
                aria-pressed={t === tamanho}
                className={`h-12 min-w-14 rounded-xl border px-4 text-sm font-bold transition-all duration-300 ease-fluid active:scale-95 ${
                  t === tamanho ? "border-brand bg-brand text-white" : `bg-superficie hover:border-ink ${avisoTamanho ? "border-erro" : "border-line"}`
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className={`text-sm font-bold ${avisoCor ? "text-erro" : ""}`}>
            {avisoCor ? "Escolhe a cor" : "Cor"}
            {cor && <span className="font-medium text-mute"> {cor}</span>}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {produto.cores.map((c) => (
              <button
                key={c.nome}
                onClick={() => setCor(c.nome)}
                aria-pressed={c.nome === cor}
                className={`flex h-12 items-center gap-2 rounded-xl border pl-2 pr-4 text-sm font-semibold transition-all duration-300 ease-fluid active:scale-95 ${
                  c.nome === cor ? "border-ink ring-1 ring-ink" : `bg-superficie hover:border-ink ${avisoCor ? "border-erro" : "border-line"}`
                }`}
              >
                <span className="size-7 rounded-lg ring-1 ring-black/10" style={{ backgroundColor: c.hex }} />
                {c.nome}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-10 hidden md:block">
          {botao}
          <p className="mt-3 text-center text-xs text-mute">O WhatsApp de {loja.nome} abre com a mensagem já escrita. Pagas e combinas a entrega na conversa.</p>
        </div>
      </div>

      {/* Telemóvel: o botão fica sempre ao alcance do polegar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-fundo/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
        {botao}
      </div>

      {guia && <GuiaTamanhos produto={produto} fechar={() => setGuia(false)} />}
    </div>
  );
}
