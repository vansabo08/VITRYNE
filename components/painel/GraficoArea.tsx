type Serie = { nome: string; cor: string; valores: number[] };

/**
 * Gráfico de área em SVG puro (sem biblioteca, leve em 3G).
 * As séries partilham a mesma escala vertical; o título de cada ponto mostra os valores do dia.
 */
export function GraficoArea({ dias, series, altura = 200 }: { dias: string[]; series: Serie[]; altura?: number }) {
  const largura = 640;
  const margem = { cima: 12, baixo: 24 };
  const max = Math.max(1, ...series.flatMap((s) => s.valores));
  const passo = dias.length > 1 ? largura / (dias.length - 1) : largura;
  const y = (v: number) => margem.cima + (1 - v / max) * (altura - margem.cima - margem.baixo);
  const fmt = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "short", timeZone: "UTC" });

  const linha = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"}${(i * passo).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = (vals: number[]) => `${linha(vals)} L${largura},${altura - margem.baixo} L0,${altura - margem.baixo} Z`;
  const rotulos = [0, Math.floor((dias.length - 1) / 2), dias.length - 1];

  return (
    <figure>
      <svg viewBox={`0 0 ${largura} ${altura}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Gráfico de ${series.map((s) => s.nome).join(" e ")} por dia`}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.nome} id={`area-${s.nome}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.cor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={s.cor} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={largura} y1={y(max * f)} y2={y(max * f)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
        ))}
        {series.map((s) => (
          <g key={s.nome}>
            <path d={area(s.valores)} fill={`url(#area-${s.nome})`} />
            <path d={linha(s.valores)} fill="none" stroke={s.cor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        {dias.map((d, i) => (
          <rect key={d} x={i * passo - passo / 2} y="0" width={passo} height={altura} fill="transparent">
            <title>{`${fmt.format(new Date(d))}: ${series.map((s) => `${s.valores[i]} ${s.nome}`).join(", ")}`}</title>
          </rect>
        ))}
        {rotulos.map((i) => (
          <text key={i} x={i * passo} y={altura - 4} fill="#A3AFC6" fontSize="11" textAnchor={i === 0 ? "start" : i === dias.length - 1 ? "end" : "middle"}>
            {fmt.format(new Date(dias[i]))}
          </text>
        ))}
      </svg>
      <figcaption className="mt-3 flex gap-5 text-xs text-mute">
        {series.map((s) => (
          <span key={s.nome} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: s.cor }} /> {s.nome}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
