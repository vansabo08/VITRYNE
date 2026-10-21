import { ShopSettings } from "@/components/ShopSettings";
import { getMinhaLoja } from "@/lib/painel";

export default async function Loja() {
  const { loja } = await getMinhaLoja();
  return <ShopSettings loja={loja} />;
}
