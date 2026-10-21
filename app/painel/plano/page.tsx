import { Check, Crown, X } from "@phosphor-icons/react/dist/ssr";
import { requireLoja } from "@/lib/painel";
import { PLANOS, estadoPlano } from "@/lib/plans";
import type { Plano } from "@/lib/types";

const RECURSOS: { nome: string; planos: Plano[] }[] = [
  { nome: "Loja com link próprio e QR code", planos: ["gratis", "basico", "pro"] },
  { nome: "Pedidos no WhatsApp com a mensagem pronta", planos: ["gratis", "basico", "pro"] },
  { nome: "Lista de pedidos e marcação de vendido", planos: ["gratis", "basico", "pro"] },
  { nome: "Visitas, taxa de clique e produtos mais vistos", planos: ["pro"] },
];

export default async function PlanoPage() {
  const loja = await requireLoja();
  const { plano, expirado, diasRestantes } = estadoPlano(loja);
  const validade = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(loja.planoValidade));
  const total = loja.produtos.length;
  const uso = plano.limite === Infinity ? null : Math.min(100, (total / plano.limite) * 100);

  return (
    <div className="space-y-6">
      <div>
        <p className="etiqueta text-realce">Conta</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">O meu plano</h1>
      </div>

      <section className="vidro relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm text-mute"><Crown className="size-4 text-realce" weight="fill" /> Plano actual</p>
            <p className="mt-2 text-4xl font-bold">{plano.nome}</p>
            <p className="mt-1 text-sm text-mute">{plano.preco}</p>
            <p className={`mt-4 text-sm font-semibold ${expirado ? "text-erro" : ""}`}>
              {expirado ? `Expirou a ${validade}` : `Válido até ${validade}, faltam ${diasRestantes} ${diasRestantes === 1 ? "dia" : "dias"}`}
            </p>
          </div>
          <div className="min-w-56">
            <div className="flex justify-between text-sm">
              <span className="text-mute">Produtos</span>
              <span className="font-semibold">{plano.limite === Infinity ? `${total}, sem limite` : `${total} de ${plano.limite}`}</span>
            </div>
            {uso !== null && (
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className={`h-2 rounded-full ${uso >= 100 ? "bg-erro" : "bg-gradient-to-r from-brand to-realce"}`} style={{ width: `${uso}%` }} />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(PLANOS) as Plano[]).map((id) => {
          const p = PLANOS[id];
          const actual = id === loja.plano;
          return (
            <section key={id} className={`vidro rounded-2xl p-6 ${actual ? "ring-1 ring-realce/50 shadow-[0_24px_60px_rgba(21,88,214,0.25)]" : ""}`}>
              <div className="flex items-center justify-between">
                <p className="etiqueta text-realce">{p.nome}</p>
                {actual && <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">O teu</span>}
              </div>
              <p className="mt-4 text-3xl font-bold">{p.preco.replace(" por mês", "")}</p>
              <p className="text-xs text-mute">{id === "gratis" ? "no primeiro mês" : "por mês"}</p>
              <p className="mt-4 text-sm font-semibold">{p.limiteTexto}</p>
              <ul className="mt-4 space-y-2.5">
                {RECURSOS.map((r) => {
                  const tem = r.planos.includes(id);
                  return (
                    <li key={r.nome} className={`flex items-start gap-2 text-sm ${tem ? "" : "text-mute/60"}`}>
                      {tem ? <Check className="mt-0.5 size-4 shrink-0 text-[#4ADE80]" weight="bold" /> : <X className="mt-0.5 size-4 shrink-0" />}
                      {r.nome}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="vidro-suave rounded-xl p-4 text-sm text-mute">
        Para mudar de plano ou renovar, fala connosco no WhatsApp. Activamos o plano à mão logo depois do pagamento.
      </p>
    </div>
  );
}
