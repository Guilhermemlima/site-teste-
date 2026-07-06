"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-server";
import { deleteImage, uploadImage, UploadValidationError } from "@/lib/storage";
import type { FormState } from "@/app/actions/auth";

const schema = z.object({
  title: z.string().trim().min(1).max(150),
  content: z.string().trim().min(1).max(4000),
  date: z.string().optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  emotion: z.string().trim().max(40).optional().or(z.literal("")),
  is_private: z.string().optional(),
});

export async function createMemoryAction(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    date: formData.get("date"),
    category: formData.get("category"),
    emotion: formData.get("emotion"),
    is_private: formData.get("is_private"),
  });
  if (!parsed.success) return { error: "Preencha ao menos o título e o texto da lembrança." };

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  const paths: string[] = [];
  try {
    for (const file of files) {
      paths.push(await uploadImage(file, "memorias"));
    }
  } catch (err) {
    if (err instanceof UploadValidationError) return { error: err.message };
    return { error: "Não foi possível enviar uma das imagens." };
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("memories").insert({
    title: parsed.data.title,
    content: parsed.data.content,
    date: parsed.data.date || null,
    category: parsed.data.category || null,
    emotion: parsed.data.emotion || null,
    is_private: parsed.data.is_private === "on",
    image_paths: paths,
  });

  if (error) return { error: `Erro ao salvar memória: ${error.message}` };

  revalidatePath("/memorias");
  revalidatePath("/privado/conteudo");
  return { success: "Memória adicionada com sucesso." };
}

export async function updateMemoryAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const parsed = schema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    date: formData.get("date"),
    category: formData.get("category"),
    emotion: formData.get("emotion"),
    is_private: formData.get("is_private"),
  });
  if (!parsed.success) return;

  const supabase = supabaseAdmin();
  await supabase
    .from("memories")
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
      date: parsed.data.date || null,
      category: parsed.data.category || null,
      emotion: parsed.data.emotion || null,
      is_private: parsed.data.is_private === "on",
    })
    .eq("id", id);

  revalidatePath("/memorias");
  revalidatePath("/privado/conteudo");
}

export async function deleteMemoryAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = supabaseAdmin();
  const { data } = await supabase.from("memories").select("image_paths").eq("id", id).maybeSingle();
  await supabase.from("memories").delete().eq("id", id);
  if (data?.image_paths?.length) {
    await Promise.all(data.image_paths.map((p: string) => deleteImage(p)));
  }

  revalidatePath("/memorias");
  revalidatePath("/privado/conteudo");
}
