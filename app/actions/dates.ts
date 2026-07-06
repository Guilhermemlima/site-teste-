"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-server";
import { deleteImage, uploadImage, UploadValidationError } from "@/lib/storage";
import type { FormState } from "@/app/actions/auth";

const schema = z.object({
  title: z.string().trim().min(1).max(150),
  date: z.string().min(1),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  is_highlighted: z.string().optional(),
});

export async function createImportantDateAction(
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    date: formData.get("date"),
    description: formData.get("description"),
    category: formData.get("category"),
    is_highlighted: formData.get("is_highlighted"),
  });
  if (!parsed.success) return { error: "Preencha ao menos o título e a data." };

  const supabase = supabaseAdmin();
  let imagePath: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imagePath = await uploadImage(imageFile, "datas");
    } catch (err) {
      if (err instanceof UploadValidationError) return { error: err.message };
      return { error: "Não foi possível enviar a imagem." };
    }
  }

  const { error } = await supabase.from("important_dates").insert({
    title: parsed.data.title,
    date: parsed.data.date,
    description: parsed.data.description || null,
    category: parsed.data.category || null,
    is_highlighted: parsed.data.is_highlighted === "on",
    image_url: imagePath,
  });

  if (error) return { error: `Erro ao salvar: ${error.message}` };

  revalidatePath("/datas");
  revalidatePath("/dashboard");
  return { success: "Data adicionada com sucesso." };
}

export async function deleteImportantDateAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = supabaseAdmin();

  const { data } = await supabase.from("important_dates").select("image_url").eq("id", id).maybeSingle();
  await supabase.from("important_dates").delete().eq("id", id);
  if (data?.image_url) await deleteImage(data.image_url);

  revalidatePath("/datas");
  revalidatePath("/dashboard");
}

export async function toggleHighlightAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const current = formData.get("current") === "true";
  if (!id) return;

  const supabase = supabaseAdmin();
  await supabase.from("important_dates").update({ is_highlighted: !current }).eq("id", id);

  revalidatePath("/datas");
  revalidatePath("/dashboard");
}
