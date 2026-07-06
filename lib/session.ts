import "server-only";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "mc_session";
export const PRIVATE_COOKIE = "mc_private";

export const MAIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias
export const PRIVATE_SESSION_MAX_AGE = 60 * 20; // 20 minutos

const encoder = new TextEncoder();

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET nao configurado no ambiente.");
  }
  return encoder.encode(secret);
}

type Scope = "main" | "private";

export async function signSessionToken(scope: Scope, maxAgeSeconds: number): Promise<string> {
  return new SignJWT({ scope })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined | null, expectedScope: Scope): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.scope === expectedScope;
  } catch {
    return false;
  }
}
