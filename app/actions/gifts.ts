"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { FormState } from "@/app/actions/auth";
import { GIFT_PRIORITIES, GIFT_STATUSES } from "@/lib/types";

const schema = z.object({
  title: z.string().trim().max(150).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  price_estimate: z.string().optional().or(z.literal("")),
  link: z.string().trim().max(500).optional().or(z.literal("")),
  priority: z.enum(GIFT_PRIORITIES),
  status: z.enum(GIFT_STATUSES),
});

function parsePrice(value: string | undefined): number | null {
  if (!value) return null;
  const normalized = value.replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export async function createGiftAction(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price_estimate: formData.get("price_estimate"),
    link: formData.get("link"),
    priority: formData.get("priority") || "media",
    status: formData.get("status") || "ideia",
  });
  if (!parsed.success) return { error: "Erro ao processar a ideia de presente." };

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("gift_ideas").insert({
    title: parsed.data.title || null,
    description: parsed.data.description || null,
    price_estimate: parsePrice(parsed.data.price_estimate),
    link: parsed.data.link || null,
    priority: parsed.data.priority,
    status: parsed.data.status,
  });

  if (error) return { error: `Erro ao salvar: ${error.message}` };

  revalidatePath("/presentes");
  return { success: "Ideia de presente adicionada." };
}

export async function updateGiftStatusAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !GIFT_STATUSES.includes(status as (typeof GIFT_STATUSES)[number])) return;

  const supabase = supabaseAdmin();
  await supabase.from("gift_ideas").update({ status }).eq("id", id);

  revalidatePath("/presentes");
}

export async function updateGiftAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const parsed = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price_estimate: formData.get("price_estimate"),
    link: formData.get("link"),
    priority: formData.get("priority") || "media",
    status: formData.get("status") || "ideia",
  });
  if (!parsed.success) return;

  const supabase = supabaseAdmin();
  await supabase
    .from("gift_ideas")
    .update({
      title: parsed.data.title || null,
      description: parsed.data.description || null,
      price_estimate: parsePrice(parsed.data.price_estimate),
      link: parsed.data.link || null,
      priority: parsed.data.priority,
      status: parsed.data.status,
    })
    .eq("id", id);

  revalidatePath("/presentes");
}

export async function deleteGiftAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = supabaseAdmin();
  await supabase.from("gift_ideas").delete().eq("id", id);

  revalidatePath("/presentes");
}
