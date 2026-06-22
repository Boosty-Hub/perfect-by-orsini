-- Perfect by Dr. Orsini — CMS schema (Supabase / Postgres)

-- Roles
do $$ begin
  create type public.user_role as enum ('admin', 'editor');
exception when duplicate_object then null; end $$;

-- Profiles (one per auth user)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  role public.user_role not null default 'editor',
  created_at timestamptz default now()
);

-- Blog categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  description text,
  sort int default 0
);

-- Articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  topic text not null,
  meta_title text,
  excerpt text,
  dek text,
  body jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  cover text,
  reading_time int default 4,
  status text not null default 'draft',
  author_name text default 'Dr. Omar Orsini',
  tags text[] not null default '{}'::text[],
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Idempotent: add `tags` to pre-existing databases created before this column.
alter table public.articles add column if not exists tags text[] not null default '{}'::text[];
create index if not exists articles_status_idx on public.articles (status, published_at desc);

-- Auto-create a profile when an auth user is created (role from metadata)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'editor')
  )
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;

-- Profiles: a user can read their own profile (admin reads via service role)
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

-- Categories: public read; authenticated manage
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories for select using (true);
drop policy if exists categories_auth_write on public.categories;
create policy categories_auth_write on public.categories
  for all to authenticated using (true) with check (true);

-- Articles: published are public; authenticated (admin/editor) manage everything
drop policy if exists articles_public_read on public.articles;
create policy articles_public_read on public.articles
  for select using (status = 'published');
drop policy if exists articles_auth_all on public.articles;
create policy articles_auth_all on public.articles
  for all to authenticated using (true) with check (true);

-- Seed categories
insert into public.categories (slug, label, description, sort) values
  ('belleza', 'Belleza', 'Realza tu belleza natural con resultados sutiles.', 1),
  ('novedades', 'Novedades', 'Lo último en medicina estética y tecnología.', 2),
  ('prevencion', 'Prevención', 'Cuida tu piel y tu bienestar a tiempo.', 3)
on conflict (slug) do nothing;
