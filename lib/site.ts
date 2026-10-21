/**
 * Endereço público do site, igual no servidor e no browser.
 * Ordem: NEXT_PUBLIC_SITE_URL (domínio próprio), depois o domínio de produção que a Vercel
 * expõe automaticamente, e por fim localhost em desenvolvimento.
 */
const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000")
).replace(/\/$/, "");

/** Domínio sem protocolo, para mostrar ao vendedor (ex.: vitryne.vercel.app/kianda-style). */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

/** Corta um texto para descrições de partilha, sem partir palavras. */
export function resumo(texto: string, max = 155): string {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (limpo.length <= max) return limpo;
  return limpo.slice(0, limpo.lastIndexOf(" ", max - 1)) + "…";
}
