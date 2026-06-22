// Downloads the real photos from the client's Google Drive folder (public link)
// and optimizes them to web-ready WebP in /public/img/drive.
// Run: node scripts/pull-assets.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("assets-src/drive");
const OUT = path.resolve("public/img/drive");

// id -> output basename (curated, descriptive). Videos (.MOV) intentionally omitted.
const files = [
  ["1a9eQbRe0KqxWckKuoyBMbEx-J-kqaLuE", "foto-01"],
  ["1yw6ymZmsBaaKEa7fhHLm5freQzM8MLE3", "foto-02"],
  ["1fyXtyceX03MNdZXUV4e85clSU4Ikoa7x", "foto-03"],
  ["1flWTliP8LwrS7xbU-vcloH4CWBTw2isr", "foto-04"],
  ["1ZPjFE60wp-xCYhdXGyPzO021Ndg-FZfO", "img-7664"],
  ["1xg1KAK9XKaZLNuuQBffRqmof6W_az8RN", "img-7585"],
  ["1KF6UvdPwnWgXqAeK1mt5z3_z_nEZLo4T", "img-7582"],
  ["1moQZmmfLCuY0_gNB9rexDvXrNZ6a8koH", "img-7581"],
  ["1wYBxzNDolPUze2q6UUANoAKZ3IPtHt36", "img-7651"],
  ["1X3mwIFH41akfgW9HCur2h35fXbLc1yPH", "img-7584"],
  ["1LzRkPEzeJSNmC9RbS4Dh_pr87-q45hXu", "img-7668"],
  ["1y2B6cZBYQiyySM6wrzvFDey-TFaIW66v", "img-7583"],
  ["1Nx-E2q69e9L1bX0l8QBG-_Z9keq8IjGD", "img-7655"],
  ["16XlmbEowvBJvKlah14pF1pfptM-kxIJ8", "img-7665"],
  ["1U4b0UeLTlubW-Q0Qnv0GSsj4iqD2s_ao", "img-7654"],
  ["1DBhNZPL9peYt1PJY7j4I9P--97wCuT5B", "img-7592"],
  ["128dXdg2KmBcWQ0HqqMIwvfv4TN_drW8o", "img-7667"],
  ["103i9lY0ICe5-3az3x0p6WKpm2xzaSvlQ", "foto-05"],
  ["1_NbDmZHb6nCyptUBeiJ9yp4nISopWlu0", "foto-06"],
  ["1fMS9qYoScfSUcuQEck9Ywpb-u06_05go", "foto-07"],
  ["1EbXQU057JvcywB8atRY7CpcWah3mkNpI", "foto-08"],
  ["1tpa0y2PbWMULmGh_l9jgdGrDhv0Jsaa1", "foto-09"],
  ["1vZkfH2OeRkvlzM2Qkz7XzE0VblZtlxNN", "foto-10"],
  ["10eRbalVT8VvjeRd94oALFuRfh9sB2whk", "foto-11"],
  ["1i12xDUewMHaDtHkQwG7Fd6NvTqBf2Fp0", "foto-12"],
  ["1JbrHN1v2VhxRasQVNWzKF4a5udBZXQWS", "foto-13"],
  ["1zMQ2lEIe_KA0eUeUbO8ib6QDUdKUUSOt", "foto-14"],
];

const dl = (id) => `https://drive.google.com/uc?export=download&id=${id}`;

await mkdir(SRC, { recursive: true });
await mkdir(OUT, { recursive: true });

let ok = 0;
let skipped = 0;
for (const [id, name] of files) {
  const outFile = path.join(OUT, `${name}.webp`);
  if (existsSync(outFile)) {
    ok++;
    continue;
  }
  try {
    const res = await fetch(dl(id), { redirect: "follow" });
    const type = res.headers.get("content-type") || "";
    const buf = Buffer.from(await res.arrayBuffer());
    if (type.includes("text/html") || buf.length < 1024) {
      console.warn(`SKIP ${name}: not a direct file (type=${type}, ${buf.length}B)`);
      skipped++;
      continue;
    }
    await writeFile(path.join(SRC, `${name}.orig`), buf);
    await sharp(buf)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outFile);
    const meta = await sharp(buf).metadata();
    console.log(`OK   ${name}.webp  (${meta.width}x${meta.height})`);
    ok++;
  } catch (err) {
    console.warn(`FAIL ${name}: ${err.message}`);
    skipped++;
  }
}
console.log(`\nDone. ${ok} optimized, ${skipped} skipped. Output: ${OUT}`);
