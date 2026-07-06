export interface PersonProfile {
  id: boolean;
  name: string | null;
  nickname: string | null;
  birth_date: string | null;
  city: string | null;
  main_photo_url: string | null; // storage path
  description: string | null;
  how_we_met: string | null;
  relationship_start_date: string | null;
  special_phrase: string | null;
  notes: string | null;
}

export const PREFERENCE_CATEGORIES = [
  { value: "comida", label: "Comidas e Bebidas" },
  { value: "presente", label: "Presentes" },
  { value: "entretenimento", label: "Entretenimento" },
  { value: "lugar", label: "Lugares" },
] as const;

export type PreferenceCategory = (typeof PREFERENCE_CATEGORIES)[number]["value"];

export interface Preference {
  id: string;
  category: string;
  title: string;
  value: string;
  notes: string | null;
  created_at: string;
}

export const DATE_CATEGORIES = [
  "Aniversário",
  "Namoro",
  "Encontro",
  "Viagem",
  "Comemorativa",
  "Lembrete",
  "Outro",
] as const;

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  description: string | null;
  category: string | null;
  image_url: string | null; // storage path
  is_highlighted: boolean;
  created_at: string;
}

export const PHOTO_CATEGORIES = [
  "Dela",
  "Minhas",
  "Nós Juntos",
  "Viagens",
  "Momentos Especiais",
  "Conversas",
  "Presentes",
  "Datas Comemorativas",
] as const;

export interface Photo {
  id: string;
  title: string | null;
  description: string | null;
  storage_path: string;
  category: string;
  is_favorite: boolean;
  is_private: boolean;
  taken_at: string | null;
  media_type?: "image" | "video";
  created_at: string;
}

export const MEMORY_CATEGORIES = [
  "Como nos conhecemos",
  "Momentos engraçados",
  "Momentos românticos",
  "Viagens",
  "Datas especiais",
  "Conversas marcantes",
  "Planos para o futuro",
] as const;

export const MEMORY_EMOTIONS = ["Feliz", "Engraçada", "Romântica", "Especial", "Saudade"] as const;

export interface Memory {
  id: string;
  title: string;
  content: string;
  date: string | null;
  category: string | null;
  emotion: string | null;
  image_paths: string[];
  is_private: boolean;
  created_at: string;
}

export const GIFT_PRIORITIES = ["baixa", "media", "alta"] as const;
export const GIFT_STATUSES = ["ideia", "comprado", "dado"] as const;

export interface GiftIdea {
  id: string;
  title: string;
  description: string | null;
  price_estimate: number | null;
  link: string | null;
  priority: string;
  status: string;
  created_at: string;
}
