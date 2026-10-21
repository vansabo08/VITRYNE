import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Renova a sessão e protege o painel. Só corre nas rotas do matcher, por isso as lojas públicas ficam leves. */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (!user && path.startsWith("/painel")) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }
  if (user && (path === "/entrar" || path === "/registo")) {
    return NextResponse.redirect(new URL("/painel", request.url));
  }
  return response;
}

export const config = { matcher: ["/painel/:path*", "/entrar", "/registo"] };
