"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Camera, Check, Copy, DownloadSimple, QrCode, ShareNetwork } from "@phosphor-icons/react";
import type { Loja, Tema } from "@/lib/types";
import { guardarLoja } from "@/app/painel/actions";
import { enviarImagem } from "@/lib/upload";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import { useToast } from "./painel/Toasts";
import { Aparencia } from "./painel/Aparencia";
import { PreVisualizacao } from "./painel/PreVisualizacao";

const campo = "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition-colors duration-300 placeholder:text-mute focus:border-realce";
const cartao = "vidro rounded-2xl p-5 md:p-6";
const CORES = ["#1558D6", "#0B2F73", "#7C3AED", "#DB2777", "#DC2626", "#EA580C", "#CA8A04", "#16A34A", "#0D9488", "#111827"];

function mostrarTelefone(n: string) {
  return n ? `+244 ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}` : "";
}

export function ShopSettings({ loja }: { loja: Loja | null }) {
  const router = useRouter();
  const avisar = useToast();
  const [nome, setNome] = useState(loja?.nome ?? "");
  const [slug, setSlug] = useState(loja?.slug ?? "");
  const [tel, setTel] = useState(mostrarTelefone(loja?.whatsapp ?? ""));
  const [descricao, setDescricao] = useState(loja?.descricao ?? "");
  const [cidade, setCidade] = useState(loja?.cidade ?? "");
  const [cor, setCor] = useState(loja?.destaque ?? "#1558D6");
  const [logotipo, setLogotipo] = useState<string | null>(loja?.logotipo ?? null);
  const [tema, setTema] = useState<Tema>(loja?.tema ?? "vitryne");
  const [banner, setBanner] = useState<string | null>(loja?.banner ?? null);
  const [bannerTitulo, setBannerTitulo] = useState(loja?.bannerTitulo ?? "");
  const [bannerTexto, setBannerTexto] = useState(loja?.bannerTexto ?? "");
  const [aviso, setAviso] = useState(loja?.aviso ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [aGuardar, setAGuardar] = useState(false);
  const [aEnviar, setAEnviar] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const link = `${SITE_URL}/${loja?.slug ?? slug}`;

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setAGuardar(true);
    const r = await guardarLoja({ nome, slug, whatsapp: tel, descricao, cidade, cor, logotipo, tema, banner, bannerTitulo, bannerTexto, aviso });
    setAGuardar(false);
    if (r.erro) {
      setErro(r.erro);
      avisar(r.erro, "erro");
      return;
    }
    setErro(null);
    avisar(loja ? "Alterações guardadas" : "Loja criada. Agora junta o primeiro produto.");
    if (!loja) router.push("/painel/produtos/novo");
    router.refresh();
  }

  async function escolherLogotipo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setAEnviar(true);
    try {
      setLogotipo(await enviarImagem(f));
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível enviar o logótipo.");
    }
    setAEnviar(false);
  }

  async function escolherBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setAEnviar(true);
    try {
      setBanner(await enviarImagem(f));
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível enviar o banner.");
    }
    setAEnviar(false);
  }

  // O QR code é gerado no browser: não gasta servidor nem dados do vendedor.
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => {
    if (!loja) return;
    let activo = true;
    import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(link, { width: 1024, margin: 2, errorCorrectionLevel: "M", color: { dark: "#0B2F73", light: "#FFFFFF" } }).then((url) => {
        if (activo) setQr(url);
      }),
    );
    return () => {
      activo = false;
    };
  }, [link, loja]);

  async function descarregar(formato: "png" | "svg") {
    const { default: QRCode } = await import("qrcode");
    const href =
      formato === "png"
        ? qr!
        : URL.createObjectURL(
            new Blob([await QRCode.toString(link, { type: "svg", margin: 2, errorCorrectionLevel: "M", color: { dark: "#0B2F73", light: "#FFFFFF" } })], { type: "image/svg+xml" }),
          );
    const a = document.createElement("a");
    a.href = href;
    a.download = `qr-${loja?.slug ?? "loja"}.${formato}`;
    a.click();
    if (formato === "svg") URL.revokeObjectURL(href);
  }

  async function copiar() {
    await navigator.clipboard?.writeText(link);
    setCopiado(true);
    avisar("Link copiado");
    setTimeout(() => setCopiado(false), 2000);
  }

  async function partilhar() {
    if (navigator.share) await navigator.share({ title: loja?.nome, url: link }).catch(() => {});
    else copiar();
  }


  return (
    <form onSubmit={guardar} noValidate className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiqueta text-realce">Definições</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{loja ? "A minha loja" : "Cria a tua loja"}</h1>
          {!loja && <p className="mt-2 text-sm text-mute">Só precisas de um nome, um link e o teu WhatsApp.</p>}
        </div>
        <button disabled={aGuardar || aEnviar} className="btn rounded-md bg-brand px-6 py-3 text-white shadow-[0_12px_32px_rgba(21,88,214,0.4)] hover:bg-[#2A6BE6] active:scale-[0.98] disabled:opacity-60">
          {aGuardar ? "A guardar" : loja ? "Guardar alterações" : "Criar loja"}
        </button>
      </div>

      {erro && <p role="alert" className="vidro rounded-xl p-4 text-sm font-semibold text-erro">{erro}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className={cartao}>
            <h2 className="etiqueta text-mute">Identidade</h2>
            <div className="mt-4 flex items-center gap-4">
              <label className="group relative flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/5 transition-colors hover:border-realce">
                {logotipo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logotipo} alt="Logótipo da loja" className="size-full object-cover" />
                ) : (
                  <Camera className="size-7 text-realce" weight="duotone" />
                )}
                <input type="file" accept="image/*" onChange={escolherLogotipo} disabled={aEnviar} className="sr-only" aria-label="Escolher logótipo" />
              </label>
              <div className="text-sm">
                <p className="font-semibold">{aEnviar ? "A enviar o logótipo…" : "Logótipo"}</p>
                <p className="text-mute">Uma imagem quadrada fica melhor. Toca para mudar.</p>
              </div>
            </div>
            <label className="mt-5 block text-sm font-semibold">Nome da loja
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Kianda Style" className={campo} />
            </label>
            <label className="mt-4 block text-sm font-semibold">Descrição
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} placeholder="O que vendes e como entregas" className={campo} />
            </label>
            <label className="mt-4 block text-sm font-semibold">Cidade
              <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Luanda" className={campo} />
            </label>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">Cor da loja</legend>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {CORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Cor ${c}`}
                    aria-pressed={cor.toUpperCase() === c}
                    onClick={() => setCor(c)}
                    className={`size-9 rounded-full ring-2 ring-offset-2 ring-offset-fundo transition-transform active:scale-90 ${cor.toUpperCase() === c ? "ring-white" : "ring-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label className="relative size-9 cursor-pointer overflow-hidden rounded-full ring-1 ring-white/20" title="Outra cor">
                  <input type="color" value={cor} onChange={(e) => setCor(e.target.value.toUpperCase())} className="absolute inset-0 size-full cursor-pointer opacity-0" aria-label="Escolher outra cor" />
                  <span className="flex size-full items-center justify-center bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)] text-[10px] font-bold">+</span>
                </label>
              </div>
            </fieldset>
          </section>

          <Aparencia
            tema={tema} setTema={setTema} cor={cor} nome={nome}
            banner={banner} setBanner={setBanner} escolherBanner={escolherBanner} aEnviar={aEnviar}
            bannerTitulo={bannerTitulo} setBannerTitulo={setBannerTitulo}
            bannerTexto={bannerTexto} setBannerTexto={setBannerTexto}
            aviso={aviso} setAviso={setAviso}
          />

          <section className={cartao}>
            <h2 className="etiqueta text-mute">Contacto e endereço</h2>
            <label className="mt-4 block text-sm font-semibold">WhatsApp para os pedidos
              <input value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" placeholder="+244 923 000 000" className={campo} />
            </label>
            <label className="mt-4 block text-sm font-semibold">Link da loja
              <div className="mt-2 flex items-center rounded-xl border border-white/10 bg-white/5 transition-colors focus-within:border-realce">
                <span className="pl-4 text-sm text-mute">{SITE_HOST}/</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} className="w-full bg-transparent px-1 py-3 text-base outline-none" />
              </div>
              <span className="mt-1 block text-xs font-normal text-mute">Letras minúsculas, números e traços. Se mudares, o link antigo deixa de funcionar.</span>
            </label>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <section className={cartao}>
            <h2 className="etiqueta text-mute">Pré-visualização</h2>
            <div className="mt-4">
              <PreVisualizacao
                tema={tema} cor={cor} nome={nome} descricao={descricao} cidade={cidade} logotipo={logotipo}
                banner={banner} bannerTitulo={bannerTitulo} bannerTexto={bannerTexto} aviso={aviso}
                produtos={(loja?.produtos ?? []).filter((p) => p.activo)}
              />
            </div>
          </section>

          {loja && (
            <section id="partilhar" className={`${cartao} scroll-mt-24`}>
              <h2 className="etiqueta text-mute">Partilhar</h2>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-2 pl-3">
                <span className="min-w-0 flex-1 truncate text-sm">{link.replace(/^https?:\/\//, "")}</span>
                <button type="button" onClick={copiar} aria-label="Copiar link" className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20">
                  {copiado ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
              </div>
              <button type="button" onClick={partilhar} className="btn mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-wa px-4 py-3 text-white hover:brightness-110">
                <ShareNetwork className="size-4" /> Partilhar link
              </button>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex size-28 shrink-0 items-center justify-center rounded-xl bg-white p-2">
                  {qr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qr} alt={`QR code do link ${link}`} width={96} height={96} className="size-full" />
                  ) : (
                    <QrCode className="size-12 text-slate-400" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <button type="button" onClick={() => descarregar("png")} disabled={!qr} className="btn flex items-center justify-center gap-2 rounded-md border border-white/15 px-3 py-2.5 hover:border-white/30 disabled:opacity-50">
                    <DownloadSimple className="size-4" /> PNG
                  </button>
                  <button type="button" onClick={() => descarregar("svg")} disabled={!qr} className="btn flex items-center justify-center gap-2 rounded-md border border-white/15 px-3 py-2.5 hover:border-white/30 disabled:opacity-50">
                    <DownloadSimple className="size-4" /> SVG
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-mute">Imprime o QR code e cola-o na banca ou nos sacos. Quem o ler abre a tua loja.</p>
            </section>
          )}
        </aside>
      </div>
    </form>
  );
}
