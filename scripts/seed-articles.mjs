// Seeds the 9 generated articles into Supabase (status=published). Run once.
// node scripts/seed-articles.mjs   (reads .env.local)
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const env = Object.fromEntries(
  (await readFile(".env.local", "utf8"))
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const arts = JSON.parse(await readFile("src/content/articles.json", "utf8"));
let ok = 0;
for (const a of arts) {
  const { error } = await sb.from("articles").upsert(
    {
      slug: a.slug,
      title: a.title,
      topic: a.topic,
      meta_title: a.metaTitle ?? null,
      excerpt: a.excerpt ?? null,
      dek: a.dek ?? null,
      body: a.body ?? [],
      faqs: a.faqs ?? [],
      cover: a.cover ?? null,
      reading_time: a.readingTime ?? 4,
      status: "published",
      published_at: a.publishedAt ?? new Date().toISOString(),
      author_name: a.author ?? "Dr. Omar Orsini",
    },
    { onConflict: "slug" },
  );
  console.log(a.slug, error ? "ERR " + error.message : "ok");
  if (!error) ok++;
}
console.log(`\n${ok}/${arts.length} articles seeded.`);
