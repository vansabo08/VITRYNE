import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Montserrat guardada no projecto (sem depender do Google Fonts no build nem no browser).
const montserrat = localFont({
  src: "../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});

const descricao =
  "Cria a loja online do teu negócio em minutos. O cliente escolhe o produto e pede no teu WhatsApp com a mensagem pronta.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "VITRYNE, a tua loja online", template: "%s | VITRYNE" },
  description: descricao,
  applicationName: "VITRYNE",
  openGraph: {
    type: "website",
    locale: "pt_AO",
    siteName: "VITRYNE",
    title: "VITRYNE, a tua loja online",
    description: descricao,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#070D1A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className={`${montserrat.variable} antialiased`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-3 focus:py-2 focus:text-white"
        >
          Saltar para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
