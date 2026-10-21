import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/site";

// Actualiza de hora a hora: lojas e produtos novos entram no sitemap sem novo deploy.
export const revalidate = 3600;

/** Só para os motores de busca: a RLS devolve apenas lojas e produtos activos. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await createPublicClient().from("lojas").select("slug, created_at, produtos(slug, created_at)");
  const lojas = (data ?? []).flatMap((l) => [
    { url: `${SITE_URL}/${l.slug}`, lastModified: l.created_at, priority: 0.8 },
    ...(l.produtos ?? []).map((p) => ({ url: `${SITE_URL}/${l.slug}/${p.slug}`, lastModified: p.created_at, priority: 0.6 })),
  ]);
  return [{ url: SITE_URL, priority: 1 }, ...lojas];
}
