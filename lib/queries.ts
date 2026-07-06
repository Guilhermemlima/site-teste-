import "server-only";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { PRIVATE_COOKIE, verifySessionToken } from "@/lib/session";
import type { GiftIdea, ImportantDate, Memory, PersonProfile, Photo, Preference } from "@/lib/types";

export async function isPrivateAreaUnlocked(): Promise<boolean> {
  const token = cookies().get(PRIVATE_COOKIE)?.value;
  return verifySessionToken(token, "private");
}

export async function getProfile(): Promise<PersonProfile | null> {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("person_profile").select("*").eq("id", true).maybeSingle();
  return data as PersonProfile | null;
}

export async function listPreferences(): Promise<Preference[]> {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("preferences").select("*").order("category").order("created_at");
  return (data as Preference[]) || [];
}

export async function listImportantDates(): Promise<ImportantDate[]> {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("important_dates").select("*").order("date");
  return (data as ImportantDate[]) || [];
}

export async function listPhotos(options: { includePrivate: boolean }): Promise<Photo[]> {
  const supabase = supabaseAdmin();
  let query = supabase.from("photos").select("*").order("created_at", { ascending: false });
  if (!options.includePrivate) {
    query = query.eq("is_private", false);
  }
  const { data } = await query;
  return (data as Photo[]) || [];
}

export async function listMemories(options: { includePrivate: boolean }): Promise<Memory[]> {
  const supabase = supabaseAdmin();
  let query = supabase.from("memories").select("*").order("date", { ascending: false, nullsFirst: false });
  if (!options.includePrivate) {
    query = query.eq("is_private", false);
  }
  const { data } = await query;
  return (data as Memory[]) || [];
}

export async function listGifts(): Promise<GiftIdea[]> {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("gift_ideas").select("*").order("created_at", { ascending: false });
  return (data as GiftIdea[]) || [];
}
