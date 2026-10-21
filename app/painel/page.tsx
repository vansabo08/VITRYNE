import Link from "next/link";
import {
  ArrowDownRight, ArrowUpRight, CheckCircle, Circle, CurrencyCircleDollar, Eye, LockSimple, Percent, WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { requireLoja } from "@/lib/painel";
import { estadoPlano } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";
import { formatKz } from "@/lib/format";
import { diaLuanda, haDias, haQuanto, ultimosDias } from "@/lib/datas";
import { GraficoArea } from "@/components/painel/GraficoArea";
import { ProductImage } from "@/components/ProductImage";

type CliqueRow = { id: string; tamanho: string; cor: string; vendido: boolean; created_at: string; produto_id: string };

function Tendencia({ atual, anterior }: { atual: number; anterior: number }) {
  if (anterior === 0) {
    return atual > 0 ? <span className="text-xs font-semibold text-[#4ADE80]">Novo neste período</span> : <span className="text-xs text-mute">Sem dados antes</span>;
  }
  const pct = Math.round(((atual - anterior) / anterior) * 100);
  const sobe = pct >= 0;
  const Icone = sobe ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${sobe ? "bg-[#4ADE80]/10 text-[#4ADE80]" : "bg-erro/10 text-erro"}`}>
      <Icone className="size-3.5" weight="bold" /> {Math.abs(pct)}%
    </span>
  );
}

export default async function Inicio({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const loja = await requireLoja();
  const { dias: diasParam } = await searchParams;
  const dias = diasParam === "7" ? 7 : 30;
  const { estatisticas: pro } = estadoPlano(loja);
  const supabase = await createClient();

  const inicioAtual = haDias(dias);
  const inicioAnterior = haDias(2 * dias);

  const [{ data: cliquesData }, { data: recentesData }, visitasRes] = await Promise.all([
    supabase.from("cliques").select("id, tamanho, cor, vendido, created_at, produto_id").eq("loja_id", loja.id).gte("created_at", inicioAnterior),
    supabase.from("cliques").select("id, tamanho, cor, vendido, created_at, produto_id").eq("loja_id", loja.id).order("created_at", { ascending: false }).limit(5),
    pro
      ? supabase.from("visitas").select("created_at, produto_id").eq("loja_id", loja.id).gte("created_at", inicioAnterior).limit(10000)
      : Promise.resolve({ data: [] as { created_at: string; produto_id: string | null }[] }),
  ]);

  const cliques = (cliquesData ?? []) as CliqueRow[];
  const visitas = visitasRes.data ?? [];
  const produtos = new Map(loja.produtos.map((p) => [p.id, p]));

  const noAtual = <T extends { created_at: string }>(l: T[]) => l.filter((x) => x.created_at >= inicioAtual);
  const noAnterior = <T extends { created_at: string }>(l: T[]) => l.filter((x) => x.created_at < inicioAtual);
  const vendidoKz = (l: CliqueRow[]) => l.filter((c) => c.vendido).reduce((s, c) => s + (produtos.get(c.produto_id)?.preco ?? 0), 0);

  const cliquesAtual = noAtual(cliques);
  const cliquesAnt = noAnterior(cliques);
  const visitasAtual = noAtual(visitas);
  const visitasAnt = noAnterior(visitas);
  const taxa = (c: number, v: number) => (v ? Math.round((c / v) * 1000) / 10 : 0);

  // Série diária para o gráfico.
  const eixo = ultimosDias(dias);
  const porDia = (l: { created_at: string }[]) => {
    const m = new Map<string, number>();
    l.forEach((x) => m.set(diaLuanda(x.created_at), (m.get(diaLuanda(x.created_at)) ?? 0) + 1));
    return eixo.map((d) => m.get(d) ?? 0);
  };

  // Produtos em destaque: por visitas no Pro, por cliques nos outros planos.
  const contagem = new Map<string, { visitas: number; cliques: number }>();
  visitasAtual.forEach((v) => {
    if (!v.produto_id) return;
    const c = contagem.get(v.produto_id) ?? { visitas: 0, cliques: 0 };
    contagem.set(v.produto_id, { ...c, visitas: c.visitas + 1 });
  });
  cliquesAtual.forEach((k) => {
    const c = contagem.get(k.produto_id) ?? { visitas: 0, cliques: 0 };
    contagem.set(k.produto_id, { ...c, cliques: c.cliques + 1 });
  });
  const destaque = [...contagem.entries()]
    .filter(([id]) => produtos.has(id))
    .sort((a, b) => (pro ? b[1].visitas - a[1].visitas : 0) || b[1].cliques - a[1].cliques)
    .slice(0, 5);

  const passos = [
    { feito: true, texto: "Criar a loja", href: "/painel/loja" },
    { feito: loja.produtos.length > 0, texto: "Adicionar o primeiro produto", href: "/painel/produtos/novo" },
    { feito: !!loja.logotipo, texto: "Pôr o logótipo da loja", href: "/painel/loja" },
    { feito: !!loja.descricao, texto: "Escrever a descrição da loja", href: "/painel/loja" },
    { feito: (recentesData ?? []).length > 0, texto: "Receber o primeiro pedido (partilha o link)", href: "/painel/loja#partilhar" },
  ];
  const feitos = passos.filter((p) => p.feito).length;

  const numeros = [
    { Icon: Eye, label: "Visitas", valor: pro ? visitasAtual.length.toLocaleString("pt-AO") : null, atual: visitasAtual.length, ant: visitasAnt.length },
    { Icon: WhatsappLogo, label: "Cliques no WhatsApp", valor: cliquesAtual.length.toLocaleString("pt-AO"), atual: cliquesAtual.length, ant: cliquesAnt.length },
    { Icon: Percent, label: "Taxa de clique", valor: pro ? `${taxa(cliquesAtual.length, visitasAtual.length)}%` : null, atual: taxa(cliquesAtual.length, visitasAtual.length), ant: taxa(cliquesAnt.length, visitasAnt.length) },
    { Icon: CurrencyCircleDollar, label: "Vendido", valor: formatKz(vendidoKz(cliquesAtual)), atual: vendidoKz(cliquesAtual), ant: vendidoKz(cliquesAnt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiqueta text-realce">Início</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Olá, {loja.nome}</h1>
        </div>
        <div className="vidro-suave flex rounded-lg p-1" role="group" aria-label="Período">
          {[7, 30].map((d) => (
            <Link
              key={d}
              href={`/painel?dias=${d}`}
              aria-current={dias === d ? "true" : undefined}
              className={`btn rounded-md px-4 py-2 transition-colors ${dias === d ? "bg-brand text-white" : "text-mute hover:text-ink"}`}
            >
              {d} dias
            </Link>
          ))}
        </div>
      </div>

      {feitos < passos.length && (
        <section className="vidro rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Põe a tua loja a vender</h2>
            <span className="text-sm text-mute">{feitos} de {passos.length}</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-brand to-realce" style={{ width: `${(feitos / passos.length) * 100}%` }} />
          </div>
          <ul className="mt-4 grid gap-1 sm:grid-cols-2">
            {passos.map((p) => (
              <li key={p.texto}>
                <Link href={p.href} className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/5 ${p.feito ? "text-mute line-through" : "font-semibold"}`}>
                  {p.feito ? <CheckCircle className="size-5 shrink-0 text-[#4ADE80]" weight="fill" /> : <Circle className="size-5 shrink-0 text-realce" />}
                  {p.texto}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {numeros.map(({ Icon, label, valor, atual, ant }) => (
          <div key={label} className="vidro rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="etiqueta text-[10px] text-mute">{label}</p>
              <Icon className="size-5 text-realce" weight="duotone" />
            </div>
            {valor === null ? (
              <Link href="/painel/plano" className="mt-4 flex items-center gap-2 text-sm font-semibold text-mute hover:text-ink">
                <LockSimple className="size-4" /> No plano Pro
              </Link>
            ) : (
              <>
                <p className="mt-3 text-2xl font-bold md:text-3xl">{valor}</p>
                <div className="mt-2"><Tendencia atual={atual} anterior={ant} /></div>
              </>
            )}
          </div>
        ))}
      </div>

      <section className="vidro rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{pro ? "Visitas e cliques" : "Cliques no WhatsApp"}</h2>
          <span className="text-xs text-mute">Últimos {dias} dias</span>
        </div>
        <div className="mt-5">
          <GraficoArea
            dias={eixo}
            series={[
              ...(pro ? [{ nome: "visitas", cor: "#1558D6", valores: porDia(visitasAtual) }] : []),
              { nome: "cliques", cor: "#7FA6F5", valores: porDia(cliquesAtual) },
            ]}
          />
        </div>
        {!pro && (
          <p className="mt-4 text-sm text-mute">
            Queres ver também as visitas e os produtos mais vistos? <Link href="/painel/plano" className="font-semibold text-realce hover:underline">Passa para o Pro</Link>.
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="vidro rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Pedidos recentes</h2>
            <Link href="/painel/pedidos" className="text-xs font-semibold text-realce hover:underline">Ver todos</Link>
          </div>
          {(recentesData ?? []).length === 0 ? (
            <p className="mt-6 text-sm text-mute">Ainda não há pedidos. Partilha o link da loja no estado do WhatsApp para começares.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {(recentesData as CliqueRow[]).map((c) => {
                const p = produtos.get(c.produto_id);
                return (
                  <li key={c.id} className="flex items-center gap-3 py-3">
                    {p ? <ProductImage src={p.fotos[0]} tipo={p.tipo} alt={p.nome} sizes="48px" className="size-12 shrink-0 rounded-lg" /> : <span className="size-12 shrink-0 rounded-lg bg-white/5" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p?.nome ?? "Produto apagado"}</p>
                      <p className="text-xs text-mute">Tamanho {c.tamanho}, {c.cor}, {haQuanto(c.created_at)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.vendido ? "bg-wa/20 text-[#4ADE80]" : "bg-white/5 text-mute"}`}>
                      {c.vendido ? "Vendido" : "Interesse"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="vidro rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Produtos em destaque</h2>
            <Link href="/painel/produtos" className="text-xs font-semibold text-realce hover:underline">Ver produtos</Link>
          </div>
          {destaque.length === 0 ? (
            <p className="mt-6 text-sm text-mute">Os produtos com mais interesse neste período aparecem aqui.</p>
          ) : (
            <ol className="mt-4 divide-y divide-white/5">
              {destaque.map(([id, c], i) => {
                const p = produtos.get(id)!;
                return (
                  <li key={id} className="flex items-center gap-3 py-3">
                    <span className="w-5 text-sm font-bold text-mute">{i + 1}</span>
                    <ProductImage src={p.fotos[0]} tipo={p.tipo} alt={p.nome} sizes="48px" className="size-12 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.nome}</p>
                      <p className="text-xs text-mute">{formatKz(p.preco)}</p>
                    </div>
                    <p className="shrink-0 text-right text-xs text-mute">
                      {pro && <span className="block"><b className="text-ink">{c.visitas}</b> visitas</span>}
                      <span className="block"><b className="text-ink">{c.cliques}</b> cliques</span>
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
