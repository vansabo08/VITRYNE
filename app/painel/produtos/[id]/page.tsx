import { notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { requireLoja } from "@/lib/painel";

export default async function EditarProduto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const loja = await requireLoja();
  const produto = loja.produtos.find((p) => p.id === id);
  if (!produto) notFound();
  return <ProductForm produto={produto} />;
}
