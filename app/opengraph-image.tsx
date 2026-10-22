import { ImageResponse } from "next/og";
import { Festoes, OG_SIZE, SimboloOg, fontes } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "VITRYNE, a tua loja online pronta em minutos";

export default async function Image() {
  const titulo = "A tua loja online, pronta em minutos.";
  const sub = "Para todo o tipo de negócio em Angola. Pedidos no WhatsApp com a mensagem já escrita.";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#FFFFFF", fontFamily: "Montserrat" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, backgroundColor: "#0B2F73", padding: "56px 72px", color: "#FFFFFF" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <SimboloOg tamanho={60} />
            <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: 6 }}>VITRYNE</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>{titulo}</span>
            <span style={{ fontSize: 30, fontWeight: 600, marginTop: 24, color: "#C9D7F5", maxWidth: 900 }}>{sub}</span>
          </div>
        </div>
        <Festoes cor="#0B2F73" />
        <div style={{ height: 30 }} />
      </div>
    ),
    { ...size, fonts: await fontes(`VITRYNE${titulo}${sub}`) },
  );
}
