import Image from "next/image";
import { Checks, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import { formatKz } from "@/lib/format";
import { SITE_HOST } from "@/lib/site";

/*
 * Peças da página inicial feitas com a interface real da VITRYNE e as fotos da loja de exemplo.
 */

const vitrine = [
  { slug: "vestido-capulana-mbanza", nome: "Vestido Capulana Mbanza", preco: 24000 },
  { slug: "tenis-urbano-lunda", nome: "Ténis Urbano Lunda", preco: 28500 },
  { slug: "hoodie-azul-mussulo", nome: "Hoodie Azul Mussulo", preco: 26000 },
  { slug: "sandalia-couro-benguela", nome: "Sandália de Couro Benguela", preco: 17000 },
];

/** A mensagem pronta, tal como chega ao vendedor. */
export function MensagemWhatsApp({ className = "" }: { className?: string }) {
  const linhas = buildWhatsAppMessage({
    loja: "Kianda Style", produto: "Ténis Urbano Lunda", tamanho: "41", cor: "Branco", preco: 28500,
    url: `${SITE_HOST}/kianda-style/tenis-urbano-lunda`,
  }).split("\n");

  return (
    <div className={`overflow-hidden rounded-2xl bg-white text-[#111b21] shadow-[0_24px_60px_rgba(11,47,115,0.25)] ${className}`}>
      <div className="flex items-center gap-3 bg-wa px-4 py-2 text-white">
        <WhatsappLogo className="size-5" weight="fill" />
        <p className="text-sm font-semibold">Kianda Style</p>
      </div>
      <div className="bg-[#EFEAE2] p-3">
        <div className="ml-auto max-w-[92%] rounded-xl rounded-tr-sm bg-[#D9FDD3] px-3 py-2 text-sm leading-5">
          {linhas.map((linha, i) =>
            linha ? (
              <p key={i} className={`break-words ${i === 2 ? "font-semibold" : ""}`}>{linha}</p>
            ) : (
              <span key={i} className="block h-2" />
            ),
          )}
          <p className="mt-1 flex items-center justify-end gap-1 text-xs text-[#667781]">
            14:32 <Checks className="size-4 text-[#53BDEB]" weight="bold" />
          </p>
        </div>
      </div>
    </div>
  );
}

/** A montra da loja de exemplo num telemóvel, com as fotos reais. */
export function MontraNoTelemovel() {
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[2.75rem] bg-line p-3 shadow-[0_40px_80px_rgba(11,47,115,0.3)]">
      <div className="overflow-hidden rounded-[2rem] bg-fundo" style={{ "--toldo": "#1558D6" } as React.CSSProperties}>
        <div className="bg-brand px-5 pb-5 pt-6 text-white">
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-base font-bold text-brand">K</span>
          <p className="mt-3 text-2xl font-bold leading-none">Kianda Style</p>
          <p className="mt-1 text-xs text-white/80">Roupa e calçado em Luanda</p>
        </div>
        <div className="toldo toldo-pequeno" />
        <ul className="grid grid-cols-2 gap-x-2 gap-y-4 p-3">
          {vitrine.map((p) => (
            <li key={p.slug}>
              <Image
                src={`/demo/${p.slug}/1.webp`}
                alt={p.nome}
                width={1000}
                height={1250}
                sizes="160px"
                className="aspect-[4/5] h-auto w-full rounded-lg object-cover"
              />
              <p className="mt-1 truncate text-xs text-mute">{p.nome}</p>
              <p className="text-sm font-bold">{formatKz(p.preco)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
