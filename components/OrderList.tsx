"use client";

import { useState, useTransition } from "react";
import { ArrowSquareOut, ChatCircleDots, CheckCircle } from "@phosphor-icons/react";
import type { Tipo } from "@/lib/types";
import { formatKz } from "@/lib/format";
import { haQuanto } from "@/lib/datas";
import { marcarVendido } from "@/app/painel/actions";
import { useToast } from "./painel/Toasts";
import { ProductImage } from "./ProductImage";

export type Pedido = {
  id: string; produto: string; preco: number; foto?: string; tipo: Tipo; link: string | null;
  tamanho: string; cor: string; data: string; vendido: boolean;
};
type Separador = "todos" | "interesse" | "vendidos";

export function OrderList({ pedidos }: { pedidos: Pedido[] }) {
  const avisar = useToast();
  const [aGuardar, iniciar] = useTransition();
  const [separador, setSeparador] = useState<Separador>("todos");

  const vendidos = pedidos.filter((p) => p.vendido);
  const lista = separador === "todos" ? pedidos : separador === "vendidos" ? vendidos : pedidos.filter((p) => !p.vendido);
  const totalVendido = vendidos.reduce((s, p) => s + p.preco, 0);
  const taxa = pedidos.length ? Math.round((vendidos.length / pedidos.length) * 100) : 0;
  const contagem = { todos: pedidos.length, interesse: pedidos.length - vendidos.length, vendidos: vendidos.length };

  function alternar(p: Pedido) {
    iniciar(async () => {
      await marcarVendido(p.id, !p.vendido);
      avisar(p.vendido ? "Pedido voltou a interesse" : `Venda registada: ${formatKz(p.preco)}`);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="etiqueta text-realce">Vendas</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Pedidos</h1>
        <p className="mt-2 text-sm text-mute">Cada clique no botão do WhatsApp aparece aqui, mesmo que o cliente não chegue a enviar a mensagem.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pedidos", valor: pedidos.length.toLocaleString("pt-AO") },
          { label: "Vendido", valor: formatKz(totalVendido) },
          { label: "Taxa de fecho", valor: `${taxa}%` },
        ].map((n) => (
          <div key={n.label} className="vidro rounded-2xl p-5">
            <p className="etiqueta text-[10px] text-mute">{n.label}</p>
            <p className="mt-3 text-2xl font-bold md:text-3xl">{n.valor}</p>
          </div>
        ))}
      </div>

      {pedidos.length === 0 ? (
        <div className="vidro rounded-2xl p-10 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand/20 text-realce">
            <ChatCircleDots className="size-8" weight="duotone" />
          </span>
          <p className="mt-4 text-xl font-bold">Ainda não há pedidos</p>
          <p className="mt-1 text-sm text-mute">Partilha o link da loja no estado do WhatsApp e no Instagram. Os pedidos aparecem aqui.</p>
        </div>
      ) : (
        <>
          <div className="vidro-suave inline-flex rounded-xl p-1" role="tablist" aria-label="Filtrar pedidos">
            {(["todos", "interesse", "vendidos"] as Separador[]).map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={separador === s}
                onClick={() => setSeparador(s)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition-colors ${separador === s ? "bg-brand text-white" : "text-mute hover:text-ink"}`}
              >
                {s} <span className="opacity-70">{contagem[s]}</span>
              </button>
            ))}
          </div>

          <ul className={`vidro divide-y divide-white/5 rounded-2xl ${aGuardar ? "opacity-70" : ""}`}>
            {lista.map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-4">
                <ProductImage src={p.foto} tipo={p.tipo} alt={p.produto} sizes="56px" className="size-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold">
                    {p.produto}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener" aria-label={`Abrir ${p.produto} na loja`} className="text-mute hover:text-ink">
                        <ArrowSquareOut className="size-4" />
                      </a>
                    )}
                  </p>
                  <p className="text-xs text-mute">Tamanho {p.tamanho}, {p.cor}, {haQuanto(p.data)}</p>
                </div>
                <p className="hidden shrink-0 text-sm font-bold sm:block">{formatKz(p.preco)}</p>
                <button
                  aria-pressed={p.vendido}
                  onClick={() => alternar(p)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ease-fluid active:scale-95 ${
                    p.vendido ? "bg-[#22C55E]/20 text-[#4ADE80] ring-1 ring-[#4ADE80]/30" : "bg-white/5 text-mute ring-1 ring-white/10 hover:text-ink"
                  }`}
                >
                  {p.vendido && <CheckCircle className="size-4" weight="fill" />}
                  {p.vendido ? "Vendido" : "Marcar vendido"}
                </button>
              </li>
            ))}
          </ul>
          {lista.length === 0 && <p className="text-center text-sm text-mute">Nada neste separador.</p>}
        </>
      )}
    </div>
  );
}
