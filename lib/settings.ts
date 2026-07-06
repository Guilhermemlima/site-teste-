import "server-only";
import { supabaseAdmin } from "@/lib/supabase-server";

export interface AppSettings {
  password_hash: string;
  private_area_password_hash: string;
}

/**
 * Le a linha unica de configuracoes (senhas em hash). Na primeira execucao,
 * se a tabela ainda estiver vazia, tenta inicializa-la a partir dos hashes
 * fornecidos nas variaveis de ambiente APP_PASSWORD_HASH / PRIVATE_AREA_PASSWORD_HASH
 * (gerados com "npm run hash-password"). Depois disso, a senha vive apenas no banco.
 */
export async function getAppSettings(): Promise<AppSettings> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("app_settings")
    .select("password_hash, private_area_password_hash")
    .eq("id", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao consultar configuracoes: ${error.message}`);
  }
  if (data) return data;

  const envMain = process.env.APP_PASSWORD_HASH;
  const envPrivate = process.env.PRIVATE_AREA_PASSWORD_HASH;

  if (!envMain || !envPrivate) {
    throw new Error(
      "Nenhuma senha configurada ainda. Gere os hashes com 'npm run hash-password', preencha APP_PASSWORD_HASH e PRIVATE_AREA_PASSWORD_HASH no .env e reinicie o servidor (veja o README)."
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from("app_settings")
    .insert({ id: true, password_hash: envMain, private_area_password_hash: envPrivate })
    .select("password_hash, private_area_password_hash")
    .single();

  if (insertError || !inserted) {
    throw new Error(`Erro ao inicializar configuracoes: ${insertError?.message ?? "desconhecido"}`);
  }

  return inserted;
}

export async function updateMainPasswordHash(newHash: string) {
  const supabase = supabaseAdmin();
  const { error } = await supabase.from("app_settings").update({ password_hash: newHash }).eq("id", true);
  if (error) throw new Error(error.message);
}

export async function updatePrivatePasswordHash(newHash: string) {
  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from("app_settings")
    .update({ private_area_password_hash: newHash })
    .eq("id", true);
  if (error) throw new Error(error.message);
}
