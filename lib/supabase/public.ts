import { createClient } from "@supabase/supabase-js";

/** Cliente anónimo, sem cookies, para as páginas públicas das lojas. A RLS só devolve lojas e produtos activos. */
export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
