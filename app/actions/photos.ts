"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-server";
import { deleteImage, uploadImage, UploadValidationError } from "@/lib/storage";
import type { FormState } from "@/app/actions/auth";

const schema = z.object({
  title: z.string().trim().max(150).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  category: z.string().trim().min(1),
  taken_at: z.string().optional().or(z.literal("")),
  is_private: z.string().optional(),
});

export async function createPhotoAction(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    taken_at: formData.get("taken_at"),
    is_private: formData.get("is_private"),
  });
  if (!parsed.success) return { error: "Selecione uma categoria válida." };

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return { error: "Selecione ao menos uma imagem para enviar." };
  }

  const supabase = supabaseAdmin();
  let uploadCount = 0;
  let lastError: string | null = null;

  for (const file of files) {
    let path: string;
    try {
      path = await uploadImage(file, "galeria");
    } catch (err) {
      if (err instanceof UploadValidationError) lastError = err.message;
      else lastError = "Não foi possível enviar uma das imagens.";
      continue;
    }

    const { error } = await supabase.from("photos").insert({
      title: null,
      description: parsed.data.description || null,
      category: parsed.data.category,
      taken_at: parsed.data.taken_at || null,
      is_private: parsed.data.is_private === "on",
      storage_path: path,
    });

    if (error) {
      lastError = `Erro ao salvar foto: ${error.message}`;
    } else {
      uploadCount++;
    }
  }

  revalidatePath("/galeria");
  revalidatePath("/privado/conteudo");

  if (uploadCount === 0) return { error: lastError || "Erro ao enviar fotos." };
  if (uploadCount === files.length) {
    return { success: `${uploadCount} ${uploadCount === 1 ? "foto adicionada" : "fotos adicionadas"} com sucesso.` };
  }
  return { success: `${uploadCount} de ${files.length} fotos adicionadas. ${lastError}` };
}

export async function deletePhotoAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = supabaseAdmin();
  const { data } = await supabase.from("photos").select("storage_path").eq("id", id).maybeSingle();
  await supabase.from("photos").delete().eq("id", id);
  if (data?.storage_path) await deleteImage(data.storage_path);

  revalidatePath("/galeria");
  revalidatePath("/privado/conteudo");
}

export async function toggleFavoritePhotoAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const current = formData.get("current") === "true";
  if (!id) return;

  const supabase = supabaseAdmin();
  await supabase.from("photos").update({ is_favorite: !current }).eq("id", id);

  revalidatePath("/galeria");
  revalidatePath("/privado/conteudo");
}

export async function togglePrivatePhotoAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const current = formData.get("current") === "true";
  if (!id) return;

  const supabase = supabaseAdmin();
  await supabase.from("photos").update({ is_private: !current }).eq("id", id);

  revalidatePath("/galeria");
  revalidatePath("/privado/conteudo");
}
