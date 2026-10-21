import { getLojaPublica } from "@/lib/data";

/**
 * Envolve a montra e a ficha do produto no estilo escolhido pelo vendedor.
 * Se a loja não existir, as páginas tratam do 404.
 */
export default async function LojaLayout({ children, params }: { children: React.ReactNode; params: Promise<{ loja: string }> }) {
  const { loja: slug } = await params;
  const loja = await getLojaPublica(slug);
  if (!loja) return children;

  return (
    <div className={`tema-${loja.tema}`} style={{ "--destaque": loja.destaque, "--toldo": loja.destaque } as React.CSSProperties}>
      {children}
    </div>
  );
}
