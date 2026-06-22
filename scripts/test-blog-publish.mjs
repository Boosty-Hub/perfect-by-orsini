// Smoke-test the publishing API against the hub's contract (docs/BLOG-API.md).
//   node scripts/test-blog-publish.mjs [baseUrl]
// Defaults to http://localhost:3000. Reads BLOG_PUBLISH_SECRET from .env.local.
import { readFile } from "node:fs/promises";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const env = Object.fromEntries(
  (await readFile(".env.local", "utf8"))
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const secret = env.BLOG_PUBLISH_SECRET;
if (!secret) {
  console.error("Falta BLOG_PUBLISH_SECRET en .env.local");
  process.exit(1);
}

const url = `${base}/api/blog/publish`;
const auth = { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" };
const post = (headers, body) => fetch(url, { method: "POST", headers, body });
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
  if (!ok) failed++;
};

// 1) Auth inválida → 401
const r401 = await post({ Authorization: "Bearer malo", "Content-Type": "application/json" }, "{}");
check("auth inválida → 401", r401.status === 401);

// 2) Health check: secreto válido + body vacío {} → 400 con {error}
const rHealth = await post(auth, "{}");
const jHealth = await rHealth.json();
check("health check {} → 400 con error", rHealth.status === 400 && typeof jHealth.error === "string", `status=${rHealth.status} error=${jHealth.error || ""}`);

// 3) Publicar (campos EXACTOS del contrato del hub) → 2xx con {id, url}
const article = {
  title: "Cómo cuidar la piel tras un peeling",
  content_html:
    "<h2>Primeras 48 horas</h2><p>Hidrata e <strong>evita el sol</strong>. " +
    '<a href="https://perfectbyorsini.com">Más info</a>.</p>' +
    "<h3>Recomendaciones</h3><ul><li>Protector solar</li><li>No exfoliar</li></ul>",
  status: "draft", // draft para no publicar en la web durante la prueba
  upsert: true,
  slug: "prueba-api-peeling",
  seo_title: "Cuidados tras un peeling | Perfect by Dr. Orsini",
  seo_description: "Guía rápida de cuidados posteriores a un peeling facial.",
  author_name: "Dr. Omar Orsini",
  category: "prevencion",
  tags: ["peeling", "cuidados"],
  cover_image: "https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg",
};
const rPub = await post(auth, JSON.stringify(article));
const jPub = await rPub.json();
check(
  "publicar → 2xx con id + url",
  rPub.status >= 200 && rPub.status < 300 && jPub.id && /^https?:\/\//.test(jPub.url || ""),
  JSON.stringify(jPub),
);

console.log(`\n${failed === 0 ? "OK ✓" : failed + " fallo(s)"}.  (El artículo de prueba es un borrador con slug "prueba-api-peeling"; bórralo en /admin si quieres.)`);
process.exit(failed === 0 ? 0 : 1);
