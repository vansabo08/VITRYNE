import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { PainelNav } from "@/components/PainelNav";
import { Toasts } from "@/components/painel/Toasts";
import { getMinhaLoja } from "@/lib/painel";
import { PLANOS, estadoPlano } from "@/lib/plans";

export const metadata = { title: "Painel", robots: { index: false } };

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const { loja } = await getMinhaLoja();
  const estado = loja ? estadoPlano(loja) : null;
  const resumo = loja
    ? { nome: loja.nome, slug: loja.slug, logotipo: loja.logotipo, destaque: loja.destaque, plano: PLANOS[loja.plano].nome }
    : null;

  return (
    <Toasts>
      <div className="fundo-painel flex min-h-screen">
        <PainelNav loja={resumo} />
        <main id="conteudo" className="min-w-0 flex-1 px-4 pb-28 pt-20 md:px-8 md:pb-10 md:pt-8">
          <div className="mx-auto max-w-5xl">
            {estado && (estado.expirado || estado.aExpirar) && (
              <div role="status" className={`vidro mb-6 flex items-start gap-3 rounded-xl p-4 text-sm ${estado.expirado ? "text-erro" : ""}`}>
                <WarningCircle className="mt-0.5 size-5 shrink-0" weight="fill" />
                <p>
                  {estado.expirado
                    ? "O teu plano expirou. A loja continua visível, mas não podes adicionar produtos até renovar. "
                    : `O teu plano termina em ${estado.diasRestantes} ${estado.diasRestantes === 1 ? "dia" : "dias"}. `}
                  <Link href="/painel/plano" className="font-semibold underline">Ver planos</Link>
                </p>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </Toasts>
  );
}
