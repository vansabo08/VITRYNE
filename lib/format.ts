export function formatKz(value: number): string {
  const digits = Math.round(value).toString();
  return `${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Kz`;
}

/** Aceita 9XXXXXXXX, 244 9XXXXXXXX ou +244 9XXXXXXXX. Devolve só dígitos com 244, ou null. */
export function normalizeAngolaPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("244") ? digits.slice(3) : digits;
  return /^9\d{8}$/.test(local) ? `244${local}` : null;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/.test(slug);
}

/** "Tamanho 42, Preto", só "Preto", ou "" quando o pedido não tem opções. */
export function descreverOpcoes(tamanho: string, cor: string): string {
  return [tamanho && `Tamanho ${tamanho}`, cor].filter(Boolean).join(", ");
}
