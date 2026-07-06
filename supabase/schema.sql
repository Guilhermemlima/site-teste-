-- =========================================================================
-- Memorias do Casal - schema do banco (Supabase / Postgres)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.
-- =========================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- Funcao utilitaria para manter updated_at sempre atualizado
-- -------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- -------------------------------------------------------------------------
-- app_settings: linha unica com os hashes de senha (login geral e area privada)
-- -------------------------------------------------------------------------
create table if not exists app_settings (
  id boolean primary key default true,
  password_hash text not null,
  private_area_password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_settings_singleton check (id)
);

create trigger app_settings_set_updated_at
before update on app_settings
for each row execute function set_updated_at();

-- -------------------------------------------------------------------------
-- person_profile: perfil da pessoa especial (linha unica)
-- -------------------------------------------------------------------------
create table if not exists person_profile (
  id boolean primary key default true,
  name text,
  nickname text,
  birth_date date,
  city text,
  main_photo_url text,
  description text,
  how_we_met text,
  relationship_start_date date,
  special_phrase text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint person_profile_singleton check (id)
);

create trigger person_profile_set_updated_at
before update on person_profile
for each row execute function set_updated_at();

-- -------------------------------------------------------------------------
-- preferences: gostos pessoais organizados por categoria
-- categoria sugerida: comida, presente, entretenimento, lugar
-- -------------------------------------------------------------------------
create table if not exists preferences (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  value text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists preferences_category_idx on preferences (category);

create trigger preferences_set_updated_at
before update on preferences
for each row execute function set_updated_at();

-- -------------------------------------------------------------------------
-- important_dates: datas especiais do casal
-- -------------------------------------------------------------------------
create table if not exists important_dates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  description text,
  category text,
  image_url text,
  is_highlighted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists important_dates_date_idx on important_dates (date);

create trigger important_dates_set_updated_at
before update on important_dates
for each row execute function set_updated_at();

-- -------------------------------------------------------------------------
-- photos: galeria de fotos (path do arquivo no Storage, nao a URL publica)
-- -------------------------------------------------------------------------
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  storage_path text not null,
  category text not null default 'geral',
  is_favorite boolean not null default false,
  is_private boolean not null default false,
  taken_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists photos_category_idx on photos (category);
create index if not exists photos_is_private_idx on photos (is_private);

create trigger photos_set_updated_at
before update on photos
for each row execute function set_updated_at();

-- -------------------------------------------------------------------------
-- memories: historias e momentos importantes do casal
-- -------------------------------------------------------------------------
create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  date date,
  category text,
  emotion text,
  image_paths text[] default '{}',
  is_private boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memories_category_idx on memories (category);
create index if not exists memories_is_private_idx on memories (is_private);

create trigger memories_set_updated_at
before update on memories
for each row execute function set_updated_at();

-- -------------------------------------------------------------------------
-- gift_ideas: ideias de presentes
-- -------------------------------------------------------------------------
create table if not exists gift_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price_estimate numeric(10, 2),
  link text,
  priority text not null default 'media', -- baixa | media | alta
  status text not null default 'ideia',   -- ideia | comprado | dado
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger gift_ideas_set_updated_at
before update on gift_ideas
for each row execute function set_updated_at();

-- =========================================================================
-- SEGURANCA: Row Level Security
--
-- O aplicativo Next.js so acessa o banco pelo servidor, usando a
-- SUPABASE_SERVICE_ROLE_KEY (que ignora RLS por design). Habilitamos RLS em
-- todas as tabelas e NAO criamos nenhuma policy para "anon"/"authenticated",
-- ou seja: a chave publica (anon) nao consegue ler nem escrever nada.
-- Isso garante que mesmo que a chave anon vaze, os dados continuam protegidos.
-- =========================================================================
alter table app_settings enable row level security;
alter table person_profile enable row level security;
alter table preferences enable row level security;
alter table important_dates enable row level security;
alter table photos enable row level security;
alter table memories enable row level security;
alter table gift_ideas enable row level security;

-- Nenhuma policy e criada de proposito: deny-all para as chaves publicas.

-- =========================================================================
-- STORAGE: crie manualmente um bucket PRIVADO chamado "casal-memorias"
-- (Supabase Studio > Storage > New bucket > Public bucket = DESLIGADO)
--
-- Como o bucket e privado e o back-end usa a service role key para
-- gerar/enviar arquivos e criar Signed URLs de curta duracao, nenhuma
-- policy de storage.objects precisa ser criada para "anon"/"authenticated" -
-- por padrao ninguem alem da service role consegue acessar os arquivos.
-- =========================================================================
