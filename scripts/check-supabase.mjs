import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "casal-memorias";

if (!url || !key) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const TABLES = [
  "app_settings",
  "person_profile",
  "preferences",
  "important_dates",
  "photos",
  "memories",
  "gift_ideas",
];

let hasError = false;

console.log(`\n== Conectando em ${url} ==\n`);

for (const table of TABLES) {
  const { error, count } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) {
    hasError = true;
    console.log(`[FALHOU] tabela "${table}": ${error.message}`);
  } else {
    console.log(`[OK] tabela "${table}" existe (linhas: ${count ?? 0})`);
  }
}

console.log("");

const { data: settingsRow, error: settingsErr } = await supabase
  .from("app_settings")
  .select("password_hash, private_area_password_hash")
  .eq("id", true)
  .maybeSingle();

if (settingsErr) {
  console.log(`[FALHOU] leitura de app_settings: ${settingsErr.message}`);
} else if (!settingsRow) {
  console.log("[INFO] app_settings ainda vazia — sera criada no primeiro login usando APP_PASSWORD_HASH/PRIVATE_AREA_PASSWORD_HASH do .env.");
} else {
  console.log("[OK] app_settings ja populada (senha principal e PIN configurados no banco).");
}

console.log("");

const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
if (bucketsErr) {
  hasError = true;
  console.log(`[FALHOU] nao foi possivel listar buckets: ${bucketsErr.message}`);
} else {
  const bucket = buckets.find((b) => b.name === bucketName);
  if (!bucket) {
    hasError = true;
    console.log(`[FALHOU] bucket "${bucketName}" nao encontrado. Buckets existentes: ${buckets.map((b) => b.name).join(", ") || "(nenhum)"}`);
  } else if (bucket.public) {
    hasError = true;
    console.log(`[ATENCAO] bucket "${bucketName}" existe mas esta PUBLICO. Ele deveria ser privado.`);
  } else {
    console.log(`[OK] bucket "${bucketName}" existe e esta privado.`);
  }
}

console.log(hasError ? "\n>>> Existem pontos a corrigir acima.\n" : "\n>>> Tudo certo!\n");
process.exit(hasError ? 1 : 0);
