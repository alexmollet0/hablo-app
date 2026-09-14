-- À exécuter dans l'éditeur SQL du projet Supabase (Dashboard > SQL Editor).
-- Profil utilisateur : langue apprise, variante (espagnol seulement), niveau, pièces, accès payant.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  target_language text not null default 'es' check (target_language in ('es', 'en')),
  variant text check (variant in ('ES', 'LatAm')),
  level int not null default 1 check (level between 1 and 9),
  onboarded boolean not null default false,
  has_paid_access boolean not null default false,
  coins int not null default 0,
  xp int not null default 0,
  owned_items text[] not null default '{}',
  equipped jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint profiles_variant_language_check check (
    (target_language = 'es' and variant in ('ES', 'LatAm'))
    or (target_language = 'en' and variant is null)
  )
);

alter table profiles enable row level security;

create policy "Un utilisateur lit/écrit seulement son propre profil"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Progression des flashcards (système de Leitner), une ligne par carte vue par un utilisateur.
create table if not exists card_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  box int not null default 1 check (box between 1 and 4),
  due_date date not null default current_date,
  updated_at timestamptz not null default now(),
  unique (user_id, card_id)
);

alter table card_progress enable row level security;

create policy "Un utilisateur lit/écrit seulement sa propre progression"
  on card_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
