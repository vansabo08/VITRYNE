import Link from "next/link";

export default function Termos() {
  return (
    <main id="conteudo" className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm font-semibold text-realce hover:underline">Voltar ao início</Link>
      <h1 className="mt-6 text-4xl font-bold">Termos de uso</h1>
      <p className="mt-4 text-base">
        Cada vendedor é responsável pelos produtos, preços e vendas da sua loja. A venda é combinada entre vendedor e cliente
        no WhatsApp. Texto provisório, a rever antes do lançamento.
      </p>
    </main>
  );
}
