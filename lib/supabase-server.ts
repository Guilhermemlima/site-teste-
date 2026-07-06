import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase com a service role key. So deve ser importado em
// Server Components, Server Actions ou Route Handlers - nunca em codigo
// que roda no navegador (o pacote "server-only" garante isso em build).
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variavel de ambiente ausente: ${name}`);
  }
  return value;
}

export function supabaseAdmin() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "casal-memorias";
