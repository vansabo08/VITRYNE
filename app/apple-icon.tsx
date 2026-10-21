import { ImageResponse } from "next/og";
import { SimboloOg } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1558D6" }}>
        <SimboloOg tamanho={112} cor="#FFFFFF" v="#1558D6" />
      </div>
    ),
    size,
  );
}
