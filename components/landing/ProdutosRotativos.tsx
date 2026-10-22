"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import tenis from "@/assets/hero-tenis.webp";
import perfume from "@/assets/hero-perfume.webp";
import auscultadores from "@/assets/hero-auscultadores.webp";
import relogio from "@/assets/hero-relogio.webp";
import mala from "@/assets/hero-mala.webp";
import cafe from "@/assets/hero-cafe.webp";

const PRODUTOS: { foto: StaticImageData; negocio: string; alt: string }[] = [
  { foto: tenis, negocio: "Calçado", alt: "Par de ténis brancos a flutuar sobre fundo escuro" },
  { foto: perfume, negocio: "Beleza", alt: "Frasco de perfume âmbar sobre fundo escuro" },
  { foto: auscultadores, negocio: "Electrónica", alt: "Auscultadores pretos sobre fundo escuro" },
  { foto: relogio, negocio: "Acessórios", alt: "Relógio de pulso com bracelete preta" },
  { foto: mala, negocio: "Moda", alt: "Mala de couro cor de laranja" },
  { foto: cafe, negocio: "Comida e bebida", alt: "Chávena de vidro com café expresso" },
];
const INTERVALO = 3500;

/** Os produtos do hero, um de cada negócio, a trocar no mesmo sítio com o efeito de flutuar. */
export function ProdutosRotativos() {
  const [actual, setActual] = useState(0);
  const [parado, setParado] = useState(false);

  useEffect(() => {
    // Quem pede menos movimento no sistema vê só o primeiro, e pode trocar pelos pontos.
    if (parado || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActual((i) => (i + 1) % PRODUTOS.length), INTERVALO);
    return () => clearInterval(t);
  }, [parado]);

  return (
    <div className="relative z-10 flex h-full flex-col">
      <div className="flutua relative flex-1">
        {PRODUTOS.map((p, i) => (
          <Image
            key={p.negocio}
            src={p.foto}
            alt={p.alt}
            priority={i === 0}
            aria-hidden={i !== actual}
            sizes="(min-width: 768px) 50vw, 90vw"
            className={`mascara-hero absolute inset-0 m-auto h-full w-full object-cover transition-all duration-1000 ease-fluid ${
              i === actual ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-3 pb-2">
        <p aria-live="polite" className="text-xs font-bold uppercase tracking-[0.2em] text-[#7FA6F5]">{PRODUTOS[actual].negocio}</p>
        <div className="flex gap-2">
          {PRODUTOS.map((p, i) => (
            <button
              key={p.negocio}
              type="button"
              onClick={() => { setActual(i); setParado(true); }}
              aria-label={`Ver ${p.negocio}`}
              aria-current={i === actual}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === actual ? "w-6 bg-white" : "w-1.5 bg-white/35 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
