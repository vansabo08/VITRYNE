/**
 * Marcador de posição com as proporções da identidade.
 * Substituir pelos ficheiros reais de brand/ quando forem colocados no projecto.
 */
export function Symbol({ className = "size-8", tone = "brand" }: { className?: string; tone?: "brand" | "white" }) {
  const main = tone === "brand" ? "#1558D6" : "#FFFFFF";
  const v = tone === "brand" ? "#FFFFFF" : "#0B2F73";
  return (
    <svg viewBox="0 0 140 160" className={className} aria-hidden="true">
      <path
        fill={main}
        d="M22 0H118L140 36a17.5 17.5 0 0 1-35 0 17.5 17.5 0 0 1-35 0 17.5 17.5 0 0 1-35 0 17.5 17.5 0 0 1-35 0Z"
      />
      <rect x="0" y="68" width="140" height="74" rx="26" fill={main} />
      <path fill={main} d="M24 135H64L28 160Z" />
      <path fill={v} d="M38 90H60L70 108 80 90H102L82 124H58Z" />
    </svg>
  );
}

export function Logo({ tone = "brand", className = "" }: { tone?: "brand" | "white"; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-bold tracking-[0.12em] ${
        tone === "brand" ? "text-ink" : "text-white"
      } ${className}`}
      aria-label="VITRYNE"
    >
      <Symbol className="h-8 w-7" tone={tone} />
      <span className="text-xl">VITRYNE</span>
    </span>
  );
}
