"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-server";

const schema = z.object({
  category: z.string().trim().min(1),
  title: z.string().trim().min(1).max(150),
  value: z.string().trim().min(1).max(500),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function createPreferenceAction(formData: FormData) {
  const parsed = schema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    value: formData.get("value"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return;

  const supabase = supabaseAdmin();
  await supabase.from("preferences").insert({
    category: parsed.data.category,
    title: parsed.data.title,
    value: parsed.data.value,
    notes: parsed.data.notes || null,
  });

  revalidatePath("/preferencias");
}

export async function updatePreferenceAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const parsed = schema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    value: formData.get("value"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return;

  const supabase = supabaseAdmin();
  await supabase
    .from("preferences")
    .update({
      title: parsed.data.title,
      value: parsed.data.value,
      notes: parsed.data.notes || null,
    })
    .eq("id", id);

  revalidatePath("/preferencias");
}

export async function deletePreferenceAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = supabaseAdmin();
  await supabase.from("preferences").delete().eq("id", id);

  revalidatePath("/preferencias");
}
