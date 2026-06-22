// Pulls each technology's SPECIFIC device/treatment images from the previous
// (Webflow) site and optimizes them to /public/img/tech. Writes src/content/tech-images.json.
// Run: node scripts/pull-tech-images.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/img/tech");
const MANIFEST = path.resolve("src/content/tech-images.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const techs = [
  "emface",
  "emsculpt-neo",
  "exilite",
  "exomind",
  "exosomas-autologos",
  "hebe",
  "hydrafacial",
  "laser-co2-fractal-aurora",
  "morpheus8",
  "quantumrf",
  "xwave",
];

const IMG = /https:\/\/cdn\.prod\.website-files\.com\/[^"'\\ )<>]*\.(?:jpg|jpeg|png|webp|avif)/gi;
const fold = (u) => u.replace(/-p-\d+\.(webp|jpg|jpeg|png|avif)$/i, ".$1");
const isJunk = (u) => /_FILL0|arrow|\/633daa|\/6303aedc|favicon|webclip/i.test(u);

async function getHtml(t) {
  const res = await fetch(`https://perfectbyorsini.com/tecnologias-exclusivas/${t}`, {
    headers: { "User-Agent": UA },
  });
  return res.text();
}

function ogImage(html) {
  const m = html.match(/og:image[^>]*content="([^"]+)"|content="([^"]+)"[^>]*og:image/i);
  const url = m ? m[1] || m[2] : null;
  return url && /cdn\.prod\.website-files\.com/.test(url) ? url : null;
}

// pass 1: fetch all + collect content images
const pages = {};
const freq = new Map();
for (const t of techs) {
  const html = await getHtml(t);
  pages[t] = html;
  const imgs = [...new Set([...(html.match(IMG) || [])].map(fold).filter((u) => !isJunk(u)))];
  for (const u of imgs) freq.set(u, (freq.get(u) || 0) + 1);
}
const isGlobal = (u) => (freq.get(u) || 0) >= 6; // appears across many pages = global chrome

async function save(url, file) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(
    path.join(OUT, file),
  );
}

await mkdir(OUT, { recursive: true });
const manifest = [];
for (const t of techs) {
  const html = pages[t];
  const og = ogImage(html);
  const content = [...new Set([...(html.match(IMG) || [])].map(fold))].filter(
    (u) => !isJunk(u) && !isGlobal(u),
  );
  // hero = og:image; ambiance = first page-specific content image distinct from hero
  const hero = og || content[0];
  const ambiance = content.find((u) => fold(u) !== fold(hero || "")) || content[1] || hero;
  try {
    await save(hero, `${t}-a.webp`);
    let ambFile = `${t}-a.webp`;
    if (ambiance && fold(ambiance) !== fold(hero)) {
      await save(ambiance, `${t}-b.webp`);
      ambFile = `${t}-b.webp`;
    }
    manifest.push({ slug: t, hero: `/img/tech/${t}-a.webp`, ambiance: `/img/tech/${ambFile}` });
    console.log(`OK   ${t}\n     hero: ${path.basename(hero)}\n     amb:  ${ambiance ? path.basename(ambiance) : "(same)"}`);
  } catch (err) {
    console.warn(`FAIL ${t}: ${err.message}`);
  }
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\nDone. ${manifest.length}/${techs.length} technologies. Manifest: ${MANIFEST}`);
