import { ImageResponse } from "next/og";
import { getLojaPublica } from "@/lib/data";
import { corTexto } from "@/lib/cor";
import { Festoes, OG_SIZE, SimboloOg, fontes } from "@/lib/og";
import { SITE_URL } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Montra da loja na VITRYNE";

export default async function Image({ params }: { params: Promise<{ loja: string }> }) {
  const { loja: slug } = await params;
  const loja = await getLojaPublica(slug);
  const nome = loja?.nome ?? "Loja VITRYNE";
  const cor = loja?.destaque ?? "#1558D6";
  const texto = corTexto(cor);
  const linha = loja?.cidade ? `Roupa e calçado em ${loja.cidade}` : "Roupa e calçado";
  const link = `${SITE_URL.replace(/^https?:\/\//, "")}/${slug}`;
  const total = loja?.produtos.filter((p) => p.activo).length ?? 0;
  const contagem = `${total} ${total === 1 ? "produto" : "produtos"}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#FFFFFF", fontFamily: "Montserrat" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flex: 1, backgroundColor: cor, color: texto, padding: "56px 72px" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 120, height: 120, borderRadius: 60, backgroundColor: "#FFFFFF", color: cor, fontSize: 60, fontWeight: 700 }}
          >
            {nome.charAt(0)}
          </div>
          <span style={{ fontSize: 96, fontWeight: 700, lineHeight: 1, letterSpacing: -3, marginTop: 32 }}>{nome}</span>
          <span style={{ fontSize: 34, fontWeight: 600, marginTop: 16, opacity: 0.85 }}>{`${linha}, ${contagem}`}</span>
        </div>
        <Festoes cor={cor} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 72px 28px" }}>
          <span style={{ fontSize: 28, fontWeight: 600, color: "#4A5A7D" }}>{link}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, fontWeight: 700, color: "#0B2F73" }}>
            <SimboloOg tamanho={34} cor="#1558D6" v="#FFFFFF" /> VITRYNE
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await fontes(`${nome}${linha}${contagem}${link}VITRYNE,`) },
  );
}
