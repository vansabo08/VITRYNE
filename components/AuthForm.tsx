"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { SITE_URL } from "@/lib/site";
import { Logo } from "./Logo";

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
      <aside style={{ "--toldo": "#0B2F73" } as React.CSSProperties} className="md:flex md:flex-col">
        <div className="bg-brand-deep px-4 pb-6 pt-5 text-white md:flex md:flex-1 md:flex-col md:justify-between md:p-12">
          <Link href="/" aria-label="VITRYNE, início"><Logo tone="white" /></Link>
          <div className="hidden md:block">
            <p className="text-5xl font-bold leading-tight">A tua loja.<br />O teu mundo.</p>
            <p className="mt-4 max-w-sm text-lg text-white/80">Uma montra com o teu nome e pedidos que chegam ao WhatsApp já escritos.</p>
          </div>
        </div>
        <div className="toldo md:hidden" aria-hidden="true" />
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
