import { NextRequest, NextResponse } from "next/server";
import { PRIVATE_COOKIE, SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const PUBLIC_PATHS = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p) || pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  const isLoggedIn = await verifySessionToken(sessionToken, "main");

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Segunda camada: qualquer rota de "conteudo" privado exige o PIN da area privada.
  if (pathname.startsWith("/privado/conteudo")) {
    const privateToken = request.cookies.get(PRIVATE_COOKIE)?.value;
    const isPrivateUnlocked = await verifySessionToken(privateToken, "private");
    if (!isPrivateUnlocked) {
      const gateUrl = new URL("/privado", request.url);
      return NextResponse.redirect(gateUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware a tudo, exceto arquivos estaticos do Next e assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)",
  ],
};
