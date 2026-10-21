import Link from "next/link";
import { Symbol } from "@/components/Logo";

export const metadata = { title: "Página não encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="conteudo" className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Symbol className="h-16 w-14" />
      <h1 className="text-4xl font-bold">Esta página não existe</h1>
      <p className="max-w-sm text-base text-mute">
        O link pode estar errado ou a loja já não está activa.
      </p>
      <Link href="/" className="btn rounded-md bg-brand px-6 py-3 text-white hover:bg-[#2A6BE6] active:scale-[0.98]">
        Ir para o início
      </Link>
    </main>
  );
}
