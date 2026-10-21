/** Texto branco ou azul profundo, conforme a cor de destaque da loja seja escura ou clara. */
export function corTexto(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const luz = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luz > 0.4 ? "#0B2F73" : "#FFFFFF";
}
