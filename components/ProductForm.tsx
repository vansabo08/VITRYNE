"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, DotsSixVertical, ImageSquare, Star, WhatsappLogo, X } from "@phosphor-icons/react";
import type { Cor, Produto, Tipo } from "@/lib/types";
import { guardarProduto } from "@/app/painel/actions";
import { enviarImagem } from "@/lib/upload";
import { formatKz } from "@/lib/format";
import { useToast } from "./painel/Toasts";
import { ProductImage } from "./ProductImage";
import { TIPOS } from "@/lib/tipos";

const sugestoes = (t: Tipo) => TIPOS.find((x) => x.id === t)?.tamanhos ?? [];
const CORES_RAPIDAS: Cor[] = [
  { nome: "Preto", hex: "#1B1B1B" }, { nome: "Branco", hex: "#F4F4F4" }, { nome: "Azul", hex: "#1558D6" },
  { nome: "Castanho", hex: "#8B5A2B" }, { nome: "Vermelho", hex: "#C62828" }, { nome: "Verde", hex: "#4F5B3A" },
  { nome: "Cinza", hex: "#8A8F98" }, { nome: "Bege", hex: "#D8C7A3" },
];
const campo = "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition-colors duration-300 placeholder:text-mute focus:border-realce";
const cartao = "vidro rounded-2xl p-5 md:p-6";

export function ProductForm({ produto }: { produto?: Produto }) {
  const router = useRouter();
  const avisar = useToast();
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [preco, setPreco] = useState(produto?.preco ? String(produto.preco) : "");
  const [categoria, setCategoria] = useState(produto?.categoria ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [activo, setActivo] = useState(produto?.activo ?? true);
  const [tipo, setTipo] = useState<Tipo>(produto?.tipo ?? "outro");
  const [tamanhos, setTamanhos] = useState<string[]>(produto?.tamanhos ?? []);
  const [cores, setCores] = useState<Cor[]>(produto?.cores ?? []);
  const [fotos, setFotos] = useState<string[]>(produto?.fotos ?? []);
  const [novoTamanho, setNovoTamanho] = useState("");
  const [novaCor, setNovaCor] = useState("");
  const [novoHex, setNovoHex] = useState("#1B1B1B");
  const [arrastar, setArrastar] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);

  const alternar = (lista: string[], v: string) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);
  // Sugestões do tipo primeiro, depois os tamanhos escritos à mão.
  const opcoesTamanho = [...sugestoes(tipo), ...tamanhos.filter((t) => !sugestoes(tipo).includes(t))];
  const adicionarTamanho = () => {
    const t = novoTamanho.trim().slice(0, 30);
    if (t && !tamanhos.some((x) => x.toLowerCase() === t.toLowerCase())) setTamanhos([...tamanhos, t]);
    setNovoTamanho("");
  };
  // Ao mudar de tipo, saem só os tamanhos sugeridos do tipo anterior; os escritos à mão ficam.
  const mudarTipo = (t: Tipo) => {
    const antigos = sugestoes(tipo);
    setTamanhos(tamanhos.filter((x) => !antigos.includes(x)));
    setTipo(t);
  };
  const adicionarCor = (c: Cor) => !cores.some((x) => x.nome.toLowerCase() === c.nome.toLowerCase()) && setCores([...cores, c]);
  const mover = (de: number, para: number) => {
    if (de === para) return;
    const nova = [...fotos];
    const [f] = nova.splice(de, 1);
    nova.splice(para, 0, f);
    setFotos(nova);
  };

  async function escolherFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const ficheiros = Array.from(e.target.files ?? []).slice(0, 6 - fotos.length);
    e.target.value = "";
    if (!ficheiros.length) return;
    setAEnviar(true);
    setErro(null);
    try {
      const urls = await Promise.all(ficheiros.map(enviarImagem));
      setFotos((f) => [...f, ...urls]);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível enviar as fotos.");
    }
    setAEnviar(false);
  }

  async function submeter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAGuardar(true);
    const r = await guardarProduto({
      id: produto?.id, nome, preco: Number(preco), categoria, descricao, tipo, tamanhos, cores, fotos, activo,
    });
    setAGuardar(false);
    if (r.erro) {
      setErro(r.erro);
      avisar(r.erro, "erro");
      return;
    }
    avisar(produto ? "Produto guardado" : "Produto criado");
    router.push("/painel/produtos");
    router.refresh();
  }

  return (
    <form onSubmit={submeter} noValidate className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/painel/produtos" aria-label="Voltar aos produtos" className="vidro-suave rounded-xl p-2.5 text-mute transition-colors hover:text-ink">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <p className="etiqueta text-realce">Catálogo</p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">{produto ? "Editar produto" : "Novo produto"}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/painel/produtos" className="btn rounded-md border border-white/15 px-5 py-3 hover:border-white/30">Cancelar</Link>
          <button disabled={aGuardar || aEnviar} className="btn rounded-md bg-brand px-6 py-3 text-white shadow-[0_12px_32px_rgba(21,88,214,0.4)] hover:bg-[#2A6BE6] active:scale-[0.98] disabled:opacity-60">
            {aGuardar ? "A guardar" : "Guardar"}
          </button>
        </div>
      </div>

      {erro && <p role="alert" className="vidro rounded-xl p-4 text-sm font-semibold text-erro">{erro}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className={cartao}>
            <h2 className="etiqueta text-mute">Informação</h2>
            <label className="mt-4 block text-sm font-semibold">Nome
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Perfume Kalahari 100 ml" className={campo} />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Preço em Kz
                <input value={preco} onChange={(e) => setPreco(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="24000" className={campo} />
              </label>
              <label className="block text-sm font-semibold">Categoria
                <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Perfumes, Vestidos, Telemóveis…" className={campo} />
              </label>
            </div>
            <label className="mt-4 block text-sm font-semibold">Descrição
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} placeholder="Material, medidas, o que vem incluído…" className={campo} />
            </label>
          </section>

          <section className={cartao}>
            <div className="flex items-center justify-between">
              <h2 className="etiqueta text-mute">Fotos</h2>
              <span className="text-xs text-mute">{fotos.length} de 6, a primeira é a capa</span>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {fotos.map((url, i) => (
                <li
                  key={url}
                  draggable
                  onDragStart={() => setArrastar(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (arrastar !== null) mover(arrastar, i); setArrastar(null); }}
                  className={`group relative overflow-hidden rounded-xl ring-1 transition-all ${i === 0 ? "ring-realce" : "ring-white/10"} ${arrastar === i ? "opacity-50" : ""}`}
                >
                  <ProductImage src={url} tipo={tipo} alt={`Foto ${i + 1}`} className="aspect-[4/5] w-full" sizes="120px" />
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Capa</span>}
                  <DotsSixVertical className="absolute bottom-1.5 left-1.5 hidden size-5 cursor-grab text-white drop-shadow md:block" aria-hidden="true" />
                  <div className="absolute right-1.5 top-1.5 flex gap-1">
                    {i > 0 && (
                      <button type="button" aria-label={`Tornar a foto ${i + 1} a capa`} onClick={() => mover(i, 0)} className="rounded-full bg-black/60 p-1.5 text-white backdrop-blur hover:bg-brand">
                        <Star className="size-3.5" weight="bold" />
                      </button>
                    )}
                    <button type="button" aria-label={`Remover foto ${i + 1}`} onClick={() => setFotos(fotos.filter((x) => x !== url))} className="rounded-full bg-black/60 p-1.5 text-white backdrop-blur hover:bg-red-600">
                      <X className="size-3.5" weight="bold" />
                    </button>
                  </div>
                </li>
              ))}
              {fotos.length < 6 && (
                <li>
                  <label className="flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 p-3 text-center transition-colors hover:border-realce hover:bg-white/5">
                    <ImageSquare className="size-7 text-realce" weight="duotone" />
                    <span className="text-xs font-semibold">{aEnviar ? "A enviar…" : "Juntar fotos"}</span>
                    <input type="file" accept="image/*" multiple disabled={aEnviar} onChange={escolherFotos} className="sr-only" />
                  </label>
                </li>
              )}
            </ul>
            <p className="mt-3 text-xs text-mute">Arrasta para mudar a ordem. As fotos ficam leves (WebP) para abrirem bem em 3G.</p>
          </section>

          <section className={cartao}>
            <h2 className="etiqueta text-mute">Tipo de produto</h2>
            <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de produto">
              {TIPOS.map((t) => (
                <button
                  type="button" key={t.id} role="radio" aria-checked={tipo === t.id}
                  onClick={() => mudarTipo(t.id)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${tipo === t.id ? "bg-brand text-white" : "bg-white/5 text-mute hover:text-ink"}`}
                >{t.nome}</button>
              ))}
            </div>
          </section>

          <section className={cartao}>
            <h2 className="etiqueta text-mute">Opções para o cliente escolher</h2>
            <p className="mt-2 text-xs text-mute">Opcional. Se o produto não tem tamanhos nem cores, deixa vazio: o cliente pede directo.</p>
            <p className="mt-5 text-sm font-semibold">Tamanhos</p>
            {opcoesTamanho.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {opcoesTamanho.map((t) => (
                <button type="button" key={t} aria-pressed={tamanhos.includes(t)} onClick={() => setTamanhos(alternar(tamanhos, t))}
                  className={`h-11 min-w-11 rounded-xl px-3 text-sm font-bold transition-colors ${tamanhos.includes(t) ? "bg-brand text-white" : "bg-white/5 text-mute ring-1 ring-white/10 hover:text-ink"}`}
                >{t}</button>
              ))}
            </div>
            )}
            <div className="mt-3 flex gap-2">
              <input value={novoTamanho} onChange={(e) => setNovoTamanho(e.target.value)} maxLength={30}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); adicionarTamanho(); } }}
                placeholder="Outro tamanho, ex.: 500 ml, 128 GB, XL" aria-label="Novo tamanho" className={`${campo} mt-0`} />
              <button type="button" onClick={adicionarTamanho} className="btn shrink-0 rounded-md border border-white/15 px-4 hover:border-white/30">Juntar</button>
            </div>
            <p className="mt-5 text-sm font-semibold">Cores</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {cores.map((c) => (
                <button type="button" key={c.nome} onClick={() => setCores(cores.filter((x) => x.nome !== c.nome))}
                  className="flex items-center gap-2 rounded-full bg-brand/20 py-1.5 pl-1.5 pr-3 text-sm font-semibold ring-1 ring-realce/30" aria-label={`Remover ${c.nome}`}>
                  <span className="size-5 rounded-full ring-1 ring-white/20" style={{ backgroundColor: c.hex }} />{c.nome}<X className="size-3.5 text-mute" />
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CORES_RAPIDAS.filter((c) => !cores.some((x) => x.nome === c.nome)).map((c) => (
                <button type="button" key={c.nome} onClick={() => adicionarCor(c)} className="flex items-center gap-2 rounded-full bg-white/5 py-1.5 pl-1.5 pr-3 text-xs font-semibold text-mute ring-1 ring-white/10 hover:text-ink">
                  <span className="size-4 rounded-full ring-1 ring-white/20" style={{ backgroundColor: c.hex }} />{c.nome}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input type="color" value={novoHex} onChange={(e) => setNovoHex(e.target.value)} aria-label="Tom da cor" className="h-12 w-14 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-white/5 p-1" />
              <input value={novaCor} onChange={(e) => setNovaCor(e.target.value)} maxLength={40}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const n = novaCor.trim(); if (n) adicionarCor({ nome: n, hex: novoHex.toUpperCase() }); setNovaCor(""); } }}
                placeholder="Outra cor, ex.: Mostarda" aria-label="Nome da cor" className={`${campo} mt-0`} />
              <button type="button" onClick={() => { const n = novaCor.trim(); if (n) adicionarCor({ nome: n, hex: novoHex.toUpperCase() }); setNovaCor(""); }}
                className="btn shrink-0 rounded-md border border-white/15 px-4 hover:border-white/30">Juntar</button>
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <section className={cartao}>
            <h2 className="etiqueta text-mute">Estado</h2>
            <button
              type="button"
              role="switch"
              aria-checked={activo}
              onClick={() => setActivo(!activo)}
              className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl bg-white/5 p-3 text-left"
            >
              <span>
                <span className="block text-sm font-semibold">{activo ? "Visível na loja" : "Escondido"}</span>
                <span className="block text-xs text-mute">{activo ? "Os clientes vêem e podem pedir." : "Só tu vês no painel."}</span>
              </span>
              <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${activo ? "bg-[#22C55E]" : "bg-white/15"}`}>
                <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-300 ease-fluid ${activo ? "left-[22px]" : "left-0.5"}`} />
              </span>
            </button>
          </section>

          <section className={cartao}>
            <h2 className="etiqueta text-mute">Como o cliente vê</h2>
            <div className="mt-4 overflow-hidden rounded-xl bg-fundo ring-1 ring-white/10">
              <ProductImage src={fotos[0]} tipo={tipo} alt={nome || "Produto"} className="aspect-[4/5] w-full" sizes="320px" />
              <div className="p-4">
                {categoria && <p className="text-xs text-mute">{categoria}</p>}
                <p className="mt-0.5 font-bold">{nome || "Nome do produto"}</p>
                <p className="mt-1 text-xl font-bold">{preco ? formatKz(Number(preco)) : "0 Kz"}</p>
                {tamanhos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tamanhos.map((t) => <span key={t} className="rounded-md bg-white/5 px-2 py-1 text-[11px] font-semibold ring-1 ring-white/10">{t}</span>)}
                  </div>
                )}
                {cores.length > 0 && (
                  <div className="mt-2 flex gap-1.5">
                    {cores.map((c) => <span key={c.nome} title={c.nome} className="size-4 rounded-full ring-1 ring-white/20" style={{ backgroundColor: c.hex }} />)}
                  </div>
                )}
                <span className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-wa py-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <WhatsappLogo className="size-4" weight="fill" /> Pedir no WhatsApp
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
