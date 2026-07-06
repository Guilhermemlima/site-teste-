import "server-only";
import { randomUUID } from "crypto";
import { STORAGE_BUCKET, supabaseAdmin } from "@/lib/supabase-server";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"] as const;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

export class UploadValidationError extends Error {}

function extensionFor(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    default:
      return "bin";
  }
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new UploadValidationError("Apenas imagens JPEG, PNG ou WebP sao aceitas.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadValidationError("A imagem deve ter no maximo 8MB.");
  }
}

export function validateVideoFile(file: File) {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type as (typeof ALLOWED_VIDEO_TYPES)[number])) {
    throw new UploadValidationError("Apenas videos MP4 ou WebM sao aceitos.");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new UploadValidationError("O video deve ter no maximo 50MB.");
  }
}

/**
 * Faz upload de uma imagem validada para o bucket privado do Supabase Storage.
 * Retorna o caminho interno (storage_path) que deve ser salvo no banco -
 * nunca a URL publica, pois o bucket e privado.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  validateImageFile(file);

  const supabase = supabaseAdmin();
  const path = `${folder}/${randomUUID()}.${extensionFor(file.type)}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Falha ao enviar imagem: ${error.message}`);
  }

  return path;
}

/**
 * Faz upload de um video validado para o bucket privado do Supabase Storage.
 * Retorna o caminho interno (storage_path) que deve ser salvo no banco.
 */
export async function uploadVideo(file: File, folder: string): Promise<string> {
  validateVideoFile(file);

  const supabase = supabaseAdmin();
  const path = `${folder}/${randomUUID()}.${extensionFor(file.type)}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Falha ao enviar video: ${error.message}`);
  }

  return path;
}

export async function deleteImage(path: string | null | undefined) {
  if (!path) return;
  const supabase = supabaseAdmin();
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

/**
 * Gera uma Signed URL de curta duracao para exibir uma imagem privada.
 * Nunca expomos URLs publicas diretas do bucket.
 */
export async function getSignedUrl(path: string | null | undefined, expiresInSeconds = 60 * 30) {
  if (!path) return null;
  const supabase = supabaseAdmin();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data) return null;
  return data.signedUrl;
}

export async function getSignedUrls(paths: (string | null | undefined)[], expiresInSeconds = 60 * 30) {
  const valid = paths.filter((p): p is string => Boolean(p));
  if (valid.length === 0) return {} as Record<string, string>;

  const supabase = supabaseAdmin();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrls(valid, expiresInSeconds);

  if (error || !data) return {} as Record<string, string>;

  const map: Record<string, string> = {};
  data.forEach((entry) => {
    if (entry.path && entry.signedUrl) map[entry.path] = entry.signedUrl;
  });
  return map;
}
