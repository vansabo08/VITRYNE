"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { SITE_URL } from "@/lib/site";
import { Logo } from "./Logo";
import vendedor from "@/assets/vendedor-arara.webp";
import vestido from "@/assets/vestido-vermelho.webp";
import tenis from "@/assets/hero-tenis.webp";
import perfume from "@/assets/hero-perfume.webp";
import auscultadores from "@/assets/hero-auscultadores.webp";
import mala from "@/assets/hero-mala.webp";
import cafe from "@/assets/hero-cafe.webp";

/** Mosaico do computador (3×3): cada foto com a sua posição na grelha. */
const MOSAICO: { foto: StaticImageData; alt: string; lugar: string }[] = [
  { foto: vendedor, alt: "Vendedor ao lado de uma arara de camisas", lugar: "row-span-2" },
  { foto: perfume, alt: "Frasco de perfume", lugar: "" },
  { foto: mala, alt: "Mala de couro", lugar: "" },
  { foto: auscultadores, alt: "Auscultadores", lugar: "" },
  { foto: cafe, alt: "Café expresso", lugar: "" },
  { foto: tenis, alt: "Ténis brancos", lugar: "" },
  { foto: vestido, alt: "Mulher de vestido vermelho", lugar: "col-span-2" },
];
/** No telemóvel, só uma faixa de quatro, para a página continuar leve. */
const FAIXA = [perfume, mala, tenis, cafe];

const input = "mt-1 w-full rounded-xl border border-line bg-superficie px-4 py-3 text-base outline-none transition-colors duration-300 focus:border-brand";

export function AuthForm({ modo }: { modo: "entrar" | "registo" }) {
  const router = useRouter();
  const [erros, setErros] = useState<{ email?: string; senha?: string; geral?: string }>({});
  const [aEnviar, setAEnviar] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const registo = modo === "registo";

  async function submeter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const senha = String(f.get("senha"));
    const novos: typeof erros = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novos.email = "Escreve um email válido.";
    if (senha.length < 8) novos.senha = "A palavra-passe precisa de pelo menos 8 caracteres.";
    setErros(novos);
    if (novos.email || novos.senha) return;

    setAEnviar(true);
    const supabase = createClient();
    if (registo) {
      const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { emailRedirectTo: `${SITE_URL}/painel` } });
      setAEnviar(false);
      if (error) {
        const msgs: Record<string, string> = {
          email_address_invalid: "Este email não é aceite. Usa um email real.",
          user_already_exists: "Já existe uma conta com este email. Tenta entrar.",
          weak_password: "A palavra-passe é fraca. Usa letras, números e símbolos.",
          over_email_send_rate_limit: "Demasiadas tentativas. Espera uns minutos.",
        };
        return setErros({ geral: msgs[error.code ?? ""] ?? "Não foi possível criar a conta. Tenta outra vez." });
      }
      if (!data.session) return setConfirmar(true);
      router.push("/painel/loja");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      setAEnviar(false);
      if (error) return setErros({ geral: "Email ou palavra-passe incorrectos." });
      router.push("/painel");
    }
    router.refresh();
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      <aside className="relative overflow-hidden bg-brand-deep text-white md:sticky md:top-0 md:h-screen">
        {/* Computador: mosaico de fotos de vários negócios */}
        <div className="absolute inset-0 hidden grid-cols-3 grid-rows-3 gap-2 p-2 md:grid" aria-hidden="true">
          {MOSAICO.map((m) => (
            <div key={m.alt} className={`relative overflow-hidden rounded-2xl ${m.lugar}`}>
              <Image src={m.foto} alt="" fill sizes="20vw" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-[#070d1a] via-[#070d1a]/30 to-[#070d1a]/60 md:block" />

        <div className="relative flex flex-col px-4 pb-5 pt-5 md:h-full md:justify-between md:p-10">
          <Link href="/" aria-label="VITRYNE, início"><Logo tone="white" /></Link>
          {/* Telemóvel: faixa de quatro fotos */}
          <ul className="mt-5 grid grid-cols-4 gap-2 md:hidden" aria-hidden="true">
            {FAIXA.map((f, i) => (
              <li key={i} className="overflow-hidden rounded-xl"><Image src={f} alt="" sizes="25vw" className="aspect-square h-auto w-full object-cover" /></li>
            ))}
          </ul>
          <div className="vidro hidden max-w-md rounded-2xl p-6 md:block">
            <p className="text-4xl font-bold leading-tight">A tua loja.<br /><span className="text-realce">O teu mundo.</span></p>
            <p className="mt-3 text-base text-white/80">Roupa, beleza, electrónica, comida: uma montra com o teu nome e pedidos que chegam ao WhatsApp já escritos.</p>
          </div>
        </div>
      </aside>
    <main id="conteudo" className="mx-auto flex w-full max-w-sm flex-col justify-center px-4 py-10 md:py-16">
      {confirmar ? (
        <>
          <h1 className="text-4xl font-bold">Confirma o teu email</h1>
          <p className="mt-4 text-base text-mute">
            Enviámos um link de confirmação para o teu email. Abre-o e depois entra no painel.
          </p>
          <Link href="/entrar" className="mt-6 inline-block btn rounded-md bg-brand px-6 py-3 text-white hover:bg-[#2A6BE6]">Entrar</Link>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">{registo ? "Cria a tua conta" : "Entra no painel"}</h1>
          <form onSubmit={submeter} noValidate className="mt-6 space-y-4">
            <label className="block text-sm font-semibold">
              Email
              <input name="email" type="email" autoComplete="email" className={input} aria-invalid={!!erros.email} />
              {erros.email && <span className="mt-1 block text-sm font-medium text-erro">{erros.email}</span>}
            </label>
            <label className="block text-sm font-semibold">
              Palavra-passe
              <input name="senha" type="password" autoComplete={registo ? "new-password" : "current-password"} className={input} aria-invalid={!!erros.senha} />
              {erros.senha && <span className="mt-1 block text-sm font-medium text-erro">{erros.senha}</span>}
            </label>
            {erros.geral && <p role="alert" className="text-sm font-medium text-erro">{erros.geral}</p>}
            <button
              disabled={aEnviar}
              className="w-full btn rounded-md bg-brand px-6 py-3 text-white hover:bg-[#2A6BE6] transition-all duration-300 ease-fluid hover:bg-brand-deep active:scale-[0.98] disabled:opacity-60"
            >
              {aEnviar ? "A aguardar" : registo ? "Criar conta" : "Entrar"}
            </button>
          </form>
          <p className="mt-6 text-sm text-mute">
            {registo ? "Já tens conta? " : "Ainda não tens loja? "}
            <Link href={registo ? "/entrar" : "/registo"} className="font-semibold text-realce hover:underline">
              {registo ? "Entrar" : "Criar a minha loja"}
            </Link>
          </p>
        </>
      )}
    </main>
    </div>
  );
}
