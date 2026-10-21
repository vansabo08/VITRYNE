import { ImageResponse } from "next/og";
import { Sneaker, TShirt } from "@phosphor-icons/react/dist/ssr";
import { getLojaPublica, getProduto } from "@/lib/data";
import { corTexto } from "@/lib/cor";
import { formatKz } from "@/lib/format";
import { OG_SIZE, SimboloOg, fontes } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Produto à venda numa loja VITRYNE";

/** As fotos são guardadas em WebP; o gerador de imagens só lê JPEG e PNG, por isso só essas entram no cartão. */
function fotoCompativel(url?: string) {
  return url && /\.(jpe?g|png)(\?|$)/i.test(url) ? url : null;
}

export default async function Image({ params }: { params: Promise<{ loja: string; produto: string }> }) {
  const { loja: slugLoja, produto: slugProduto } = await params;
  const loja = await getLojaPublica(slugLoja);
  const produto = loja && getProduto(loja, slugProduto);
  const cor = loja?.destaque ?? "#1558D6";
  const nomeLoja = loja?.nome ?? "Loja VITRYNE";
  const nome = produto?.nome ?? "Produto";
  const preco = produto ? formatKz(produto.preco) : "";
  const tamanhos = produto ? `Tamanhos ${produto.tamanhos.join(", ")}` : "";
  const foto = fotoCompativel(produto?.fotos[0]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#FFFFFF", fontFamily: "Montserrat" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 680, padding: "56px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 32, backgroundColor: cor, color: corTexto(cor), fontSize: 32, fontWeight: 700 }}>
              {nomeLoja.charAt(0)}
            </div>
            <span style={{ fontSize: 32, fontWeight: 700, color: "#0B2F73" }}>{nomeLoja}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#0B2F73" }}>{nome}</span>
            <span style={{ fontSize: 56, fontWeight: 700, marginTop: 20, color: "#1558D6" }}>{preco}</span>
            <span style={{ fontSize: 28, fontWeight: 600, marginTop: 12, color: "#4A5A7D" }}>{tamanhos}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", backgroundColor: "#128C7E", color: "#FFFFFF", fontSize: 28, fontWeight: 700, padding: "14px 28px", borderRadius: 16 }}>
              Pedir no WhatsApp
            </span>
            <SimboloOg tamanho={40} cor="#1558D6" v="#FFFFFF" />
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, backgroundColor: cor, alignItems: "center", justifyContent: "center" }}>
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt="" width={520} height={630} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            produto?.tipo === "calcado" ? (
            <Sneaker size={300} color={corTexto(cor)} weight="light" />
          ) : (
            <TShirt size={300} color={corTexto(cor)} weight="light" />
          )
          )}
        </div>
      </div>
    ),
    { ...size, fonts: await fontes(`${nomeLoja}${nome}${preco}${tamanhos}Pedir no WhatsApp`) },
  );
}
