"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Eye, EyeSlash, MagnifyingGlass, PencilSimple, Plus, Trash, Package, WhatsappLogo } from "@phosphor-icons/react";
import type { Produto } from "@/lib/types";
import { formatKz } from "@/lib/format";
import { alternarProduto, apagarProduto } from "@/app/painel/actions";
import { useToast } from "./painel/Toasts";
import { ProductImage } from "./ProductImage";

type Estado = "todos" | "activos" | "escondidos";

export function ProductList({
  produtos, limite, planoNome, cheio, expirado, pedidos,
}: {
  produtos: Produto[]; limite: number; planoNome: string; cheio: boolean; expirado: boolean;
  /** Cliques no WhatsApp por produto nos últimos 30 dias. */
  pedidos: Record<string, number>;
}) {
  const avisar = useToast();
  const [apagar, setApagar] = useState<Produto | null>(null);
  const [aGuardar, iniciar] = useTransition();
  const [busca, setBusca] = useState("");
  const [estado, setEstado] = useState<Estado>("todos");
  const [categoria, setCategoria] = useState("");

  const categorias = useMemo(() => Array.from(new Set(produtos.map((p) => p.categoria).filter(Boolean))).sort(), [produtos]);
  const visiveis = produtos.filter((p) => {
    if (estado === "activos" && !p.activo) return false;
    if (estado === "escondidos" && p.activo) return false;
    if (categoria && p.categoria !== categoria) return false;
    return !busca || p.nome.toLowerCase().includes(busca.trim().toLowerCase());
  });
  const contagem = { todos: produtos.length, activos: produtos.filter((p) => p.activo).length, escondidos: produtos.filter((p) => !p.activo).length };
  const uso = limite === Infinity ? null : Math.min(100, (produtos.length / limite) * 100);

  function alternar(p: Produto) {
    iniciar(async () => {
      await alternarProduto(p.id, !p.activo);
      avisar(p.activo ? `«${p.nome}» escondido da loja` : `«${p.nome}» visível na loja`);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiqueta text-realce">Catálogo</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Produtos</h1>
        </div>
        {cheio ? (
          <Link href="/painel/plano" className="btn rounded-md border border-white/15 px-6 py-3 text-mute hover:text-ink">
            {expirado ? "Plano expirado" : "Limite atingido, ver planos"}
          </Link>
        ) : (
          <Link href="/painel/produtos/novo" className="btn flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-white shadow-[0_12px_32px_rgba(21,88,214,0.4)] hover:bg-[#2A6BE6] active:scale-[0.98]">
            <Plus className="size-4" weight="bold" /> Novo produto
          </Link>
        )}
      </div>

      <div className="vidro rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {limite === Infinity ? `${produtos.length} produtos` : `${produtos.length} de ${limite} produtos`}
          </span>
          <span className="text-mute">Plano {planoNome}</span>
        </div>
        {uso !== null && (
          <div className="mt-2 h-1.5 rounded-full bg-white/10">
            <div className={`h-1.5 rounded-full ${uso >= 100 ? "bg-erro" : "bg-gradient-to-r from-brand to-realce"}`} style={{ width: `${uso}%` }} />
          </div>
        )}
      </div>

      {produtos.length === 0 ? (
        <div className="vidro rounded-2xl p-10 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand/20 text-realce">
            <Package className="size-8" weight="duotone" />
          </span>
          <p className="mt-4 text-xl font-bold">Ainda não tens produtos</p>
          <p className="mt-1 text-sm text-mute">Tira uma foto com o telemóvel e cria o primeiro. Leva um minuto.</p>
          <Link href="/painel/produtos/novo" className="btn mt-6 inline-flex rounded-md bg-brand px-6 py-3 text-white hover:bg-[#2A6BE6]">Criar o primeiro produto</Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="vidro-suave flex flex-1 items-center gap-2 rounded-xl px-3">
              <MagnifyingGlass className="size-5 text-mute" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Procurar produto"
                aria-label="Procurar produto"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-mute"
              />
            </label>
            <div className="vidro-suave flex rounded-xl p-1" role="tablist" aria-label="Estado">
              {(["todos", "activos", "escondidos"] as Estado[]).map((e) => (
                <button
                  key={e}
                  role="tab"
                  aria-selected={estado === e}
                  onClick={() => setEstado(e)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${estado === e ? "bg-brand text-white" : "text-mute hover:text-ink"}`}
                >
                  {e} <span className="opacity-70">{contagem[e]}</span>
                </button>
              ))}
            </div>
            {categorias.length > 1 && (
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                aria-label="Categoria"
                className="vidro-suave rounded-xl px-3 py-3 text-sm outline-none"
              >
                <option value="" className="bg-superficie">Todas as categorias</option>
                {categorias.map((c) => <option key={c} value={c} className="bg-superficie">{c}</option>)}
              </select>
            )}
          </div>

          {visiveis.length === 0 ? (
            <p className="vidro-suave rounded-xl p-6 text-center text-sm text-mute">Nenhum produto corresponde a esta pesquisa.</p>
          ) : (
            <ul className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 ${aGuardar ? "opacity-70" : ""}`}>
              {visiveis.map((p) => (
                <li key={p.id} className="vidro group overflow-hidden rounded-2xl">
                  <Link href={`/painel/produtos/${p.id}`} className="relative block">
                    <ProductImage src={p.fotos[0]} tipo={p.tipo} alt={p.nome} sizes="(min-width: 768px) 30vw, 50vw" className={`aspect-[4/5] w-full transition-transform duration-700 ease-fluid group-hover:scale-[1.03] ${p.activo ? "" : "opacity-40 grayscale"}`} />
                    <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${p.activo ? "bg-[#4ADE80]/20 text-[#4ADE80]" : "bg-black/50 text-mute"}`}>
                      {p.activo ? "Na loja" : "Escondido"}
                    </span>
                  </Link>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{p.nome}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-sm font-bold">{formatKz(p.preco)}</p>
                      {(pedidos[p.id] ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-xs text-mute" title="Cliques no WhatsApp nos últimos 30 dias">
                          <WhatsappLogo className="size-3.5" /> {pedidos[p.id]}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex gap-1 border-t border-white/5 pt-2">
                      <button aria-label={p.activo ? `Esconder ${p.nome}` : `Mostrar ${p.nome}`} onClick={() => alternar(p)} className="flex-1 rounded-lg p-2 text-mute transition-colors hover:bg-white/5 hover:text-ink">
                        {p.activo ? <Eye className="mx-auto size-5" /> : <EyeSlash className="mx-auto size-5" />}
                      </button>
                      <Link href={`/painel/produtos/${p.id}`} aria-label={`Editar ${p.nome}`} className="flex-1 rounded-lg p-2 text-mute transition-colors hover:bg-white/5 hover:text-ink">
                        <PencilSimple className="mx-auto size-5" />
                      </Link>
                      <button aria-label={`Apagar ${p.nome}`} onClick={() => setApagar(p)} className="flex-1 rounded-lg p-2 text-mute transition-colors hover:bg-erro/10 hover:text-erro">
                        <Trash className="mx-auto size-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {apagar && (
        <div role="dialog" aria-modal="true" aria-label="Confirmar eliminação" className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center">
          <div className="vidro w-full max-w-sm rounded-2xl p-6">
            <h2 className="text-xl font-bold">Apagar «{apagar.nome}»?</h2>
            <p className="mt-2 text-sm text-mute">Esta acção não se pode desfazer. Se só queres parar de o mostrar, esconde o produto.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setApagar(null)} className="btn flex-1 rounded-md border border-white/15 px-4 py-3 hover:border-white/30">Cancelar</button>
              <button
                onClick={() => {
                  const p = apagar;
                  setApagar(null);
                  iniciar(async () => {
                    await apagarProduto(p.id);
                    avisar(`«${p.nome}» apagado`);
                  });
                }}
                className="btn flex-1 rounded-md bg-red-600 px-4 py-3 text-white hover:bg-red-500"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
