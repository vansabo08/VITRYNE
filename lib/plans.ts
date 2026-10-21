import type { Loja, Plano } from "./types";

export const PLANOS: Record<Plano, { nome: string; preco: string; limite: number; limiteTexto: string }> = {
  gratis: { nome: "Grátis", preco: "0 Kz", limite: 10, limiteTexto: "Até 10 produtos" },
  basico: { nome: "Básico", preco: "5.000 Kz por mês", limite: 50, limiteTexto: "Até 50 produtos" },
  pro: { nome: "Pro", preco: "10.000 Kz por mês", limite: Infinity, limiteTexto: "Produtos ilimitados e estatísticas" },
};

/**
 * Estado do plano para o painel. Os limites reais são impostos na base de dados
 * (trigger em produtos e RLS em visitas); isto só serve para mostrar a interface certa.
 */
export function estadoPlano(loja: Loja) {
  const plano = PLANOS[loja.plano];
  const validade = new Date(loja.planoValidade);
  const expirado = validade < new Date();
  const diasRestantes = Math.ceil((validade.getTime() - Date.now()) / 86_400_000);
  const total = loja.produtos.length;
  return {
    plano,
    expirado,
    diasRestantes,
    aExpirar: !expirado && diasRestantes <= 7 && loja.plano !== "pro",
    cheio: expirado || total >= plano.limite,
    estatisticas: loja.plano === "pro" && !expirado,
  };
}
