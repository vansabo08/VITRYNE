import { WhatsappLogo } from "@phosphor-icons/react";
import type { Produto, Tema } from "@/lib/types";
import { ProductImage } from "@/components/ProductImage";

/**
 * A loja em miniatura, no estilo escolhido. Usa as mesmas classes tema-* da loja real,
 * por isso as cores e letras batem certo com o que o cliente vai ver.
 */
export function PreVisualizacao(p: {
  tema: Tema; cor: string; nome: string; descricao: string; cidade: string; logotipo: string | null;
  banner: string | null; bannerTitulo: string; bannerTexto: string; aviso: string; produtos: Produto[];
}) {
  const nome = p.nome || "Nome da loja";
  const titulo = p.bannerTitulo || nome;
  const texto = p.bannerTexto || p.descricao;
  const fotos = Array.from({ length: 3 }, (_, i) => p.produtos[i]);

  const avatar = p.logotipo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.logotipo} alt="" className="size-7 rounded-full bg-white object-cover" />
  ) : (
    <span className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: p.cor }}>{nome.charAt(0)}</span>
  );

  return (
    <div
      className={`tema-${p.tema} !min-h-0 ![background-attachment:scroll] overflow-hidden rounded-xl ring-1 ring-white/10`}
      style={{ "--destaque": p.cor } as React.CSSProperties}
    >
      {p.aviso && p.tema !== "vitryne" && (
        <p className="truncate px-3 py-1.5 text-center text-[9px] font-semibold uppercase tracking-wider text-white" style={{ backgroundColor: p.tema === "boutique" ? "#111" : p.cor }}>
          {p.aviso}
        </p>
      )}

      {/* Cabeçalho */}
      {p.tema === "vitryne" && (
        <div className="vidro m-2 flex items-center gap-2 rounded-xl px-2.5 py-2">
          {avatar}
          <span className="truncate text-xs font-bold">{nome}</span>
          <span className="ml-auto rounded-full bg-wa p-1 text-white"><WhatsappLogo className="size-3" weight="fill" /></span>
        </div>
      )}
      {p.tema === "boutique" && (
        <div className="border-b border-line px-3 py-3 text-center">
          <span className="letra-revista block truncate text-lg uppercase leading-none">{nome}</span>
          {p.cidade && <span className="mt-1 block text-[8px] uppercase tracking-[0.3em] text-mute">{p.cidade}</span>}
        </div>
      )}
      {p.tema === "moderno" && (
        <div className="flex items-center border-b border-line px-3 py-2.5">
          <span className="truncate text-sm font-bold" style={{ color: p.cor }}>{nome}</span>
          <WhatsappLogo className="ml-auto size-4" />
        </div>
      )}

      {/* Banner ou bloco com o nome */}
      {p.banner ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.banner} alt="" className="aspect-[16/9] w-full object-cover" />
          <div className={`absolute inset-0 flex flex-col justify-center px-4 ${p.tema === "boutique" ? "items-center bg-white/35 text-center text-[#111]" : "bg-gradient-to-r from-black/60 to-transparent text-white"}`}>
            <span className={`line-clamp-2 leading-tight ${p.tema === "boutique" ? "letra-revista text-lg" : p.tema === "moderno" ? "text-sm font-bold uppercase" : "text-base font-bold"}`}>{titulo}</span>
          </div>
        </div>
      ) : (
        <div className={`px-4 py-5 ${p.tema === "boutique" ? "bg-superficie text-center" : p.tema === "moderno" ? "mx-2 mt-2 rounded-md bg-superficie" : ""}`}>
          <span className={`block leading-tight ${p.tema === "boutique" ? "letra-revista text-xl" : p.tema === "moderno" ? "text-base font-bold uppercase" : "text-xl font-bold"}`}>{titulo}</span>
          {texto && <span className="mt-1 line-clamp-2 block text-[10px] text-mute">{texto}</span>}
        </div>
      )}

      {/* Primeiros produtos */}
      <div className="grid grid-cols-3 gap-1.5 p-2">
        {fotos.map((prod, i) =>
          prod ? (
            <ProductImage
              key={prod.id}
              src={prod.fotos[0]}
              tipo={prod.tipo}
              alt={prod.nome}
              sizes="100px"
              className={`w-full ${p.tema === "boutique" ? "aspect-[3/4]" : p.tema === "moderno" ? "aspect-[4/5] rounded-md border border-line" : "aspect-[4/5] rounded-md"}`}
            />
          ) : (
            <span key={i} className="aspect-[4/5] rounded-md bg-superficie" />
          ),
        )}
      </div>
    </div>
  );
}
