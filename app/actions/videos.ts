"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { deleteImage, uploadVideo, UploadValidationError } from "@/lib/storage";
import type { FormState } from "@/app/actions/auth";

export async function createVideoAction(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const files = formData.getAll("videos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return { error: "Selecione ao menos um vídeo para enviar." };
  }

  const supabase = supabaseAdmin();
  let uploadCount = 0;
  let lastError: string | null = null;

  for (const file of files) {
    let path: string;
    try {
      path = await uploadVideo(file, "videos");
    } catch (err) {
      if (err instanceof UploadValidationError) lastError = err.message;
      else lastError = "Não foi possível enviar um dos vídeos.";
      continue;
    }

    const { error } = await supabase.from("photos").insert({
      title: null,
      description: null,
      category: "Nós Juntos",
      taken_at: null,
      is_private: false,
      media_type: "video",
      storage_path: path,
    });

    if (error) {
      lastError = `Erro ao salvar vídeo: ${error.message}`;
    } else {
      uploadCount++;
    }
  }

  revalidatePath("/galeria");
  revalidatePath("/privado/conteudo");

  if (uploadCount === 0) return { error: lastError || "Erro ao enviar vídeos." };
  if (uploadCount === files.length) {
    return { success: `${uploadCount} ${uploadCount === 1 ? "vídeo adicionado" : "vídeos adicionados"} com sucesso.` };
  }
  return { success: `${uploadCount} de ${files.length} vídeos adicionados. ${lastError}` };
}

export async function deleteVideoAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = supabaseAdmin();
  const { data } = await supabase.from("photos").select("storage_path").eq("id", id).maybeSingle();
  await supabase.from("photos").delete().eq("id", id);
  if (data?.storage_path) await deleteImage(data.storage_path);

  revalidatePath("/galeria");
  revalidatePath("/privado/conteudo");
}

export async function toggleFavoriteVideoAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const current = formData.get("current") === "true";
  if (!id) return;

  const supabase = supabaseAdmin();
  await supabase.from("photos").update({ is_favorite: !current }).eq("id", id);

  revalidatePath("/galeria");
  revalidatePath("/privado/conteudo");
}

export async function togglePrivateVideoAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const current = formData.get("current") === "true";
  if (!id) return;

  const supabase = supabaseAdmin();
  await supabase.from("photos").update({ is_private: !current }).eq("id", id);

  revalidatePath("/galeria");
  revalidatePath("/privado/conteudo");
}
