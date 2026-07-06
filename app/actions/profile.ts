"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-server";
import { deleteImage, uploadImage, UploadValidationError } from "@/lib/storage";
import type { FormState } from "@/app/actions/auth";

const profileSchema = z.object({
  name: z.string().trim().max(200).optional().or(z.literal("")),
  nickname: z.string().trim().max(120).optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  how_we_met: z.string().trim().max(2000).optional().or(z.literal("")),
  relationship_start_date: z.string().optional().or(z.literal("")),
  special_phrase: z.string().trim().max(300).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

function emptyToNull(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

export async function saveProfileAction(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    birth_date: formData.get("birth_date"),
    city: formData.get("city"),
    description: formData.get("description"),
    how_we_met: formData.get("how_we_met"),
    relationship_start_date: formData.get("relationship_start_date"),
    special_phrase: formData.get("special_phrase"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: "Dados inválidos. Verifique os campos preenchidos." };
  }

  const supabase = supabaseAdmin();
  const photoFile = formData.get("main_photo");

  let mainPhotoPath: string | undefined;
  if (photoFile instanceof File && photoFile.size > 0) {
    try {
      const { data: existing } = await supabase
        .from("person_profile")
        .select("main_photo_url")
        .eq("id", true)
        .maybeSingle();

      mainPhotoPath = await uploadImage(photoFile, "perfil");

      if (existing?.main_photo_url) {
        await deleteImage(existing.main_photo_url);
      }
    } catch (err) {
      if (err instanceof UploadValidationError) {
        return { error: err.message };
      }
      return { error: "Não foi possível enviar a foto. Tente novamente." };
    }
  }

  const payload: Record<string, unknown> = {
    id: true,
    name: emptyToNull(parsed.data.name),
    nickname: emptyToNull(parsed.data.nickname),
    birth_date: emptyToNull(parsed.data.birth_date),
    city: emptyToNull(parsed.data.city),
    description: emptyToNull(parsed.data.description),
    how_we_met: emptyToNull(parsed.data.how_we_met),
    relationship_start_date: emptyToNull(parsed.data.relationship_start_date),
    special_phrase: emptyToNull(parsed.data.special_phrase),
    notes: emptyToNull(parsed.data.notes),
  };

  if (mainPhotoPath) {
    payload.main_photo_url = mainPhotoPath;
  }

  const { error } = await supabase.from("person_profile").upsert(payload, { onConflict: "id" });

  if (error) {
    return { error: `Erro ao salvar perfil: ${error.message}` };
  }

  revalidatePath("/perfil");
  revalidatePath("/dashboard");

  return { success: "Perfil salvo com sucesso." };
}
