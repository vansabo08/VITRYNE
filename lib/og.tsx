/* Peças comuns das imagens de partilha (Open Graph), geradas com next/og. */

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Montserrat em TTF via Google Fonts, só com as letras usadas.
 * Se falhar (sem rede), a imagem sai com a letra por omissão em vez de falhar.
 */
export async function fonteMontserrat(texto: string, peso: 600 | 700 = 700): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Montserrat:wght@${peso}&text=${encodeURIComponent(texto)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export async function fontes(texto: string) {
  const [bold, semi] = await Promise.all([fonteMontserrat(texto, 700), fonteMontserrat(texto, 600)]);
  return [
    ...(bold ? [{ name: "Montserrat", data: bold, weight: 700 as const, style: "normal" as const }] : []),
    ...(semi ? [{ name: "Montserrat", data: semi, weight: 600 as const, style: "normal" as const }] : []),
  ];
}

/** A borda do toldo: semicírculos da cor do bloco, pendurados por baixo dele. */
export function Festoes({ cor, raio = 30 }: { cor: string; raio?: number }) {
  const n = Math.ceil(OG_SIZE.width / (raio * 2)) + 1;
  return (
    <div style={{ display: "flex", height: raio, overflow: "hidden", width: "100%" }}>
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          style={{ width: raio * 2, height: raio * 2, borderRadius: raio, backgroundColor: cor, marginTop: -raio, flexShrink: 0 }}
        />
      ))}
    </div>
  );
}

/** O símbolo da VITRYNE (provisório até chegarem os ficheiros de brand/). */
export function SimboloOg({ tamanho = 56, cor = "#FFFFFF", v = "#0B2F73" }: { tamanho?: number; cor?: string; v?: string }) {
  return (
    <svg width={tamanho * (140 / 160)} height={tamanho} viewBox="0 0 140 160">
      <path fill={cor} d="M22 0H118L140 36a17.5 17.5 0 0 1-35 0 17.5 17.5 0 0 1-35 0 17.5 17.5 0 0 1-35 0 17.5 17.5 0 0 1-35 0Z" />
      <rect x="0" y="68" width="140" height="74" rx="26" fill={cor} />
      <path fill={cor} d="M24 135H64L28 160Z" />
      <path fill={v} d="M38 90H60L70 108 80 90H102L82 124H58Z" />
    </svg>
  );
}
