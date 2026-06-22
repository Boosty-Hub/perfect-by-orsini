-- Leads / form submissions. Inserts happen via the service-role client in a
-- server action (bypasses RLS); only authenticated admins can read/manage.
create extension if not exists pgcrypto;

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  form_source  text not null,            -- human label of the form, e.g. "Landing: Rinoplastia", "Home"
  service_slug text,                      -- service/tech slug when it comes from a landing
  kind         text,                      -- cirugia | tratamiento | tecnologia | home | contacto
  name         text not null,
  phone        text not null,
  email        text,
  interest     text,                      -- procedure / area of interest
  message      text,
  meta         jsonb not null default '{}'::jsonb,
  status       text not null default 'new', -- new | contacted | archived
  page_path    text
);

alter table public.leads enable row level security;

drop policy if exists "leads select authenticated" on public.leads;
create policy "leads select authenticated" on public.leads
  for select to authenticated using (true);

drop policy if exists "leads update authenticated" on public.leads;
create policy "leads update authenticated" on public.leads
  for update to authenticated using (true) with check (true);

drop policy if exists "leads delete authenticated" on public.leads;
create policy "leads delete authenticated" on public.leads
  for delete to authenticated using (true);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_source_idx on public.leads (form_source);
