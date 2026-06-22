// Fetches fresh, topic-fitting Pexels covers for given blog slugs, optimizes them
// to /public/img/blog, and updates the `cover` column in Supabase.
// Run: PEXELS_API_KEY=... node scripts/blog-covers.mjs
import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) { console.error("Missing PEXELS_API_KEY"); process.exit(1); }

const env = Object.fromEntries(
  (await readFile(".env.local", "utf8")).split("\n").filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const OUT = path.resolve("public/img/blog");
await mkdir(OUT, { recursive: true });

// slug -> Pexels query (distinct, elegant, on-topic)
const covers = {
  "armonia-facial-sin-cirugia": "serene woman natural beauty face portrait",
  "cuidados-piel-despues-de-un-tratamiento": "woman applying skincare cream routine",
  "belleza-natural-resultados-sutiles": "natural makeup beauty portrait soft light",
};

async function pick(query, skip = 0) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape&size=large`;
  const res = await fetch(url, { headers: { Authorization: KEY } });
  const json = await res.json();
  return (json.photos || [])[skip] || (json.photos || [])[0];
}

for (const [slug, query] of Object.entries(covers)) {
  try {
    const photo = await pick(query);
    if (!photo) { console.warn(`NO RESULT ${slug}`); continue; }
    const src = photo.src.large2x ?? photo.src.large ?? photo.src.original;
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, `${slug}.webp`));
    const cover = `/img/blog/${slug}.webp`;
    const { error } = await sb.from("articles").update({ cover }).eq("slug", slug);
    console.log(`${slug}  <- ${query}  (${photo.photographer})  ${error ? "DB ERR " + error.message : "cover updated"}`);
  } catch (e) {
    console.warn(`FAIL ${slug}: ${e.message}`);
  }
}
console.log("\nDone.");
