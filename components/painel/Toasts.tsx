"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";

type Toast = { id: number; texto: string; tipo: "ok" | "erro" };
const Contexto = createContext<(texto: string, tipo?: Toast["tipo"]) => void>(() => {});

/** Avisos curtos no canto (ex.: "Produto guardado"). Desaparecem sozinhos ao fim de 3,5 s. */
export function Toasts({ children }: { children: React.ReactNode }) {
  const [lista, setLista] = useState<Toast[]>([]);

  const avisar = useCallback((texto: string, tipo: Toast["tipo"] = "ok") => {
    const id = Date.now() + Math.random();
    setLista((l) => [...l, { id, texto, tipo }]);
    setTimeout(() => setLista((l) => l.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <Contexto.Provider value={avisar}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4 md:bottom-8 md:items-end md:pr-8">
        {lista.map((t) => (
          <div key={t.id} role="status" className="vidro toast-entra flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold">
            {t.tipo === "ok" ? <CheckCircle className="size-5 text-[#4ADE80]" weight="fill" /> : <WarningCircle className="size-5 text-erro" weight="fill" />}
            {t.texto}
          </div>
        ))}
      </div>
    </Contexto.Provider>
  );
}

export function useToast() {
  return useContext(Contexto);
}
