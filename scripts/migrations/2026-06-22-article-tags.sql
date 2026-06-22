-- Adds the `tags` column to the articles table (string array).
-- Idempotent. Run with:
--   SUPABASE_ACCESS_TOKEN=... SUPABASE_PROJECT_REF=imptqjcqfeqcvtqjsbdy \
--     node scripts/db-query.mjs scripts/migrations/2026-06-22-article-tags.sql
alter table public.articles add column if not exists tags text[] not null default '{}'::text[];
