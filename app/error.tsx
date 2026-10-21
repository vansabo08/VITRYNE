"use client";

import { useEffect } from "react";
import { Symbol } from "@/components/Logo";

/** Falha inesperada (quase sempre rede). Oferece tentar de novo em vez de dizer que a página não existe. */
export default function Erro({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="conteudo" className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Symbol className="h-16 w-14" />
      <h1 className="text-4xl font-bold">Não foi possível carregar</h1>
      <p className="max-w-sm text-base text-mute">A ligação falhou a meio. Verifica a internet e tenta outra vez.</p>
      <button onClick={() => retry()} className="btn rounded-md bg-brand px-6 py-3 text-white hover:bg-[#2A6BE6] active:scale-[0.98]">
        Tentar de novo
      </button>
    </main>
  );
}
