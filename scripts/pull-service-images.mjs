// Pulls each service's SPECIFIC image from the previous (published) site → /public/img/service.
// Writes src/content/service-images.json. Run: node scripts/pull-service-images.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/img/service");
const MANIFEST = path.resolve("src/content/service-images.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const slugs = [
  "rinoplastia", "mamoplastia", "lipoescultura", "aumento-de-gluteos",
  "blefaroplastia", "otoplastia", "lifting-facial",
  "bioestimuladores", "celulitis-y-flacidez", "estrias-y-cicatrices",
  "mesoterapia-y-vitaminas", "peeling-facial", "plasma-rico-en-plaquetas",
  "reduccion-de-grasa", "regeneracion-capilar", "rejuvenecimiento-corporal",
  "relleno-de-labios", "toxina-botulinica",
];

const IMG = /https:\/\/cdn\.prod\.website-files\.com\/[^"'\\ )<>]*\.(?:jpg|jpeg|png|webp|avif)/gi;
const fold = (u) => u.replace(/-p-\d+\.(webp|jpg|jpeg|png|avif)$/i, ".$1");
const isJunk = (u) => /_FILL0|arrow|\/633daa|\/6303aedc|favicon|webclip|logo|isotipo|simbolo/i.test(u);

async function getHtml(s) {
  const res = await fetch(`https://perfectbyorsini.com/servicios/${s}`, { headers: { "User-Agent": UA } });
  return res.text();
}
function ogImage(html) {
  const m = html.match(/og:image[^>]*content="([^"]+)"|content="([^"]+)"[^>]*og:image/i);
  const url = m ? m[1] || m[2] : null;
  return url && /cdn\.prod\.website-files\.com/.test(url) ? url : null;
}

const pages = {};
const freq = new Map();
for (const s of slugs) {
  const html = await getHtml(s);
  pages[s] = html;
  const imgs = [...new Set([...(html.match(IMG) || [])].map(fold).filter((u) => !isJunk(u)))];
  for (const u of imgs) freq.set(u, (freq.get(u) || 0) + 1);
}
const isGlobal = (u) => (freq.get(u) || 0) >= 5;

async function save(url, file) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, file));
}

await mkdir(OUT, { recursive: true });
const manifest = [];
for (const s of slugs) {
  const html = pages[s];
  const og = ogImage(html);
  const content = [...new Set([...(html.match(IMG) || [])].map(fold))].filter((u) => !isJunk(u) && !isGlobal(u));
  const hero = og || content[0];
  const ambiance = content.find((u) => fold(u) !== fold(hero || "")) || content[1] || hero;
  try {
    if (!hero) throw new Error("no image");
    await save(hero, `${s}-a.webp`);
    let ambFile = `${s}-a.webp`;
    if (ambiance && fold(ambiance) !== fold(hero)) {
      await save(ambiance, `${s}-b.webp`);
      ambFile = `${s}-b.webp`;
    }
    manifest.push({ slug: s, hero: `/img/service/${s}-a.webp`, ambiance: `/img/service/${ambFile}` });
    console.log(`OK   ${s}  <- ${path.basename(hero).replace(/^[0-9a-f]+_/, "").slice(0, 50)}`);
  } catch (err) {
    console.warn(`FAIL ${s}: ${err.message}`);
  }
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\nDone. ${manifest.length}/${slugs.length} services. Manifest: ${MANIFEST}`);
