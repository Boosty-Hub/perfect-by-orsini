// Fetches referential header videos from Pexels for selected landings + the blog.
// Run: PEXELS_API_KEY=xxxx node scripts/pull-pexels-videos.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) { console.error("Missing PEXELS_API_KEY"); process.exit(1); }

const OUT = path.resolve("public/videos");
const MANIFEST = path.resolve("src/content/videos.json");

// slug -> query (a few surgeries, a few treatments, and the blog)
const queries = {
  rinoplastia: "elegant woman face beauty portrait",
  lipoescultura: "woman fitness body slow motion",
  mamoplastia: "confident elegant woman portrait",
  "peeling-facial": "facial skincare treatment spa",
  "rejuvenecimiento-corporal": "spa wellness massage relax",
  bioestimuladores: "skincare face woman beauty",
  blog: "beauty skincare aesthetic lifestyle",
};

await mkdir(OUT, { recursive: true });

function pickFile(files) {
  const mp4 = files.filter((f) => f.file_type === "video/mp4" && f.width);
  // prefer ~1280–1600 wide to balance quality and size
  const sorted = mp4.sort((a, b) => a.width - b.width);
  return (
    sorted.find((f) => f.width >= 1280 && f.width <= 1700) ||
    sorted.find((f) => f.width >= 1100) ||
    sorted[sorted.length - 1]
  );
}

const manifest = [];
for (const [slug, query] of Object.entries(queries)) {
  try {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape&size=medium`;
    const res = await fetch(url, { headers: { Authorization: KEY } });
    if (!res.ok) throw new Error(`search ${res.status}`);
    const json = await res.json();
    const vid = (json.videos || []).find((v) => v.video_files?.length);
    if (!vid) { console.warn(`NO VIDEO ${slug}`); continue; }
    const file = pickFile(vid.video_files);
    const dl = await fetch(file.link);
    await pipeline(Readable.fromWeb(dl.body), createWriteStream(path.join(OUT, `${slug}.mp4`)));
    manifest.push({ slug, src: `/videos/${slug}.mp4`, photographer: vid.user?.name, url: vid.url, w: file.width, h: file.height });
    console.log(`OK   ${slug}.mp4  ${file.width}x${file.height}  (${vid.user?.name})`);
  } catch (err) {
    console.warn(`FAIL ${slug}: ${err.message}`);
  }
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\nDone. ${manifest.length}/${Object.keys(queries).length} videos. Manifest: ${MANIFEST}`);
