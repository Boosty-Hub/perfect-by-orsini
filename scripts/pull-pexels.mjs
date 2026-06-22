// Fetches topic-relevant referential photos from Pexels (one query per service),
// optimizes to WebP in /public/img/pexels, and writes src/content/pexels.json
// (slug -> { hero, ambiance, credits }).
//
// Run: PEXELS_API_KEY=xxxx node scripts/pull-pexels.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  console.error("Missing PEXELS_API_KEY env var.");
  process.exit(1);
}

const OUT = path.resolve("public/img/pexels");
const MANIFEST = path.resolve("src/content/pexels.json");

// slug -> Pexels search query (tasteful, illustrative, on-topic for an aesthetic clinic)
const queries = {
  // surgeries
  rinoplastia: "elegant woman face profile beauty",
  mamoplastia: "confident elegant woman portrait",
  lipoescultura: "fit woman body silhouette",
  "aumento-de-gluteos": "fitness woman athletic body",
  blefaroplastia: "woman eyes close up beauty",
  otoplastia: "woman portrait studio elegant",
  "lifting-facial": "mature woman radiant skin",
  // treatments
  bioestimuladores: "facial skincare treatment woman",
  "celulitis-y-flacidez": "spa body massage wellness",
  "estrias-y-cicatrices": "smooth skin body care",
  "mesoterapia-y-vitaminas": "facial skincare clinic woman",
  "peeling-facial": "facial treatment spa woman",
  "plasma-rico-en-plaquetas": "skincare serum face glow",
  "reduccion-de-grasa": "fitness woman healthy body",
  "regeneracion-capilar": "healthy shiny hair woman",
  "rejuvenecimiento-corporal": "spa wellness relax woman",
  "relleno-de-labios": "woman lips beauty close up",
  "toxina-botulinica": "woman smooth radiant skin face",
  // technologies
  emface: "facial skincare glowing woman",
  "emsculpt-neo": "fitness body workout gym",
  exilite: "laser skin treatment clinic",
  exomind: "wellness calm meditation woman",
  "exosomas-autologos": "skincare science laboratory serum",
  hebe: "glowing skin facial woman",
  hydrafacial: "facial hydration spa treatment",
  "laser-co2-fractal-aurora": "laser facial skin treatment",
  morpheus8: "facial skin treatment clinic",
  quantumrf: "skin tightening facial treatment",
  xwave: "body treatment spa wellness",
};

await mkdir(OUT, { recursive: true });

async function search(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query,
  )}&per_page=4&orientation=landscape&size=large`;
  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);
  const json = await res.json();
  return json.photos ?? [];
}

async function save(photo, file) {
  const src = photo.src.large2x ?? photo.src.large ?? photo.src.original;
  const res = await fetch(src);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, file));
}

const manifest = [];
for (const [slug, query] of Object.entries(queries)) {
  try {
    const photos = await search(query);
    if (!photos.length) {
      console.warn(`NO RESULTS ${slug} ("${query}")`);
      continue;
    }
    const heroPhoto = photos[0];
    const ambPhoto = photos[1] ?? photos[0];
    await save(heroPhoto, `${slug}-a.webp`);
    if (ambPhoto !== heroPhoto) await save(ambPhoto, `${slug}-b.webp`);
    manifest.push({
      slug,
      hero: `/img/pexels/${slug}-a.webp`,
      ambiance: `/img/pexels/${slug}-${ambPhoto !== heroPhoto ? "b" : "a"}.webp`,
      credits: [
        { photographer: heroPhoto.photographer, url: heroPhoto.url },
        ...(ambPhoto !== heroPhoto
          ? [{ photographer: ambPhoto.photographer, url: ambPhoto.url }]
          : []),
      ],
    });
    console.log(`OK   ${slug}  <- "${query}"  (${heroPhoto.photographer})`);
  } catch (err) {
    console.warn(`FAIL ${slug}: ${err.message}`);
  }
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\nDone. ${manifest.length}/${Object.keys(queries).length} services imaged. Manifest: ${MANIFEST}`);
