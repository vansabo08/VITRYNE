/** Data (AAAA-MM-DD) no fuso de Luanda, para agrupar visitas e cliques por dia como o vendedor os vive. */
export function diaLuanda(data: Date | string): string {
  return new Date(data).toLocaleDateString("en-CA", { timeZone: "Africa/Luanda" });
}

/** Os últimos `n` dias (do mais antigo para hoje), em AAAA-MM-DD de Luanda. */
export function ultimosDias(n: number): string[] {
  const hoje = new Date();
  return Array.from({ length: n }, (_, i) => diaLuanda(new Date(hoje.getTime() - (n - 1 - i) * 86_400_000)));
}

/** "há 3 h", "há 2 dias" — para listas de pedidos recentes. */
export function haQuanto(data: string): string {
  const min = Math.round((Date.now() - new Date(data).getTime()) / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return `há ${d} ${d === 1 ? "dia" : "dias"}`;
}

/** Momento de há `n` dias, em ISO, para filtrar consultas por período. */
export function haDias(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}
