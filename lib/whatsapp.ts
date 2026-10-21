import { formatKz } from "./format";

type Pedido = {
  loja: string;
  produto: string;
  tamanho: string;
  cor: string;
  preco: number;
  url: string;
};

export function buildWhatsAppMessage(p: Pedido): string {
  return [
    `Olá! Quero este produto da ${p.loja}:`,
    "",
    p.produto,
    `Tamanho: ${p.tamanho}`,
    `Cor: ${p.cor}`,
    `Preço: ${formatKz(p.preco)}`,
    "",
    `Link: ${p.url}`,
  ].join("\n");
}

export function buildWhatsAppUrl(numero: string, p: Pedido): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(buildWhatsAppMessage(p))}`;
}
