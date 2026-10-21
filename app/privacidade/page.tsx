import Link from "next/link";

export default function Privacidade() {
  return (
    <main id="conteudo" className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm font-semibold text-realce hover:underline">Voltar ao início</Link>
      <h1 className="mt-6 text-4xl font-bold">Privacidade</h1>
      <p className="mt-4 text-base">
        Guardamos o teu email, os dados da loja e os cliques no botão do WhatsApp (produto, tamanho, cor e data). Não guardamos
        dados de pagamento, porque a VITRYNE não processa pagamentos. Texto provisório, a rever antes do lançamento.
      </p>
    </main>
  );
}
