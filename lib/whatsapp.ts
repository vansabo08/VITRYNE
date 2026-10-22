import { formatKz } from "./format";

type Pedido = {
  loja: string;
  produto: string;
  /** '' quando o produto não tem tamanhos: a linha não aparece. */
  tamanho: string;
  /** '' quando o produto não tem cores: a linha não aparece. */
  cor: string;
  preco: number;
  url: string;
};

export function buildWhatsAppMessage(p: Pedido): string {
  return [
    `Olá! Quero este produto da ${p.loja}:`,
    "",
    p.produto,
    ...(p.tamanho ? [`Tamanho: ${p.tamanho}`] : []),
    ...(p.cor ? [`Cor: ${p.cor}`] : []),
    `Preço: ${formatKz(p.preco)}`,
    "",
    `Link: ${p.url}`,
  ].join("\n");
}

export function buildWhatsAppUrl(numero: string, p: Pedido): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(buildWhatsAppMessage(p))}`;
}
