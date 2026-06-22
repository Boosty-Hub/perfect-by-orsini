import sanitizeHtml from "sanitize-html";

/**
 * Helpers for the external publishing API (`POST /api/blog/publish`).
 *
 * The remote "hub" (an external SEO project) sends articles as HTML with images
 * referenced by public URL. This module normalizes a tolerant incoming payload
 * (many common field-name aliases) into the shape the `articles` table expects,
 * sanitizes the HTML body, and derives missing fields (slug, excerpt, reading time).
 *
 * The body is stored as a single typed block `{ type: "html", text }`, rendered by
 * <ArticleBody> inside the `.article-html` prose container.
 */

/** Blog categories this site renders (slug + accepted aliases/labels). */
export const KNOWN_TOPICS = [
  { slug: "belleza", labels: ["belleza", "beauty"] },
  { slug: "novedades", labels: ["novedades", "novedad", "news", "novelties", "actualidad"] },
  { slug: "prevencion", labels: ["prevencion", "prevención", "prevention", "cuidados", "salud"] },
] as const;

const RAW_DEFAULT_TOPIC = process.env.BLOG_DEFAULT_TOPIC || "novedades";
/** Falls back to a rendered topic so a misconfigured env can't store articles whose
 *  category page would 404. */
export const DEFAULT_TOPIC = KNOWN_TOPICS.some((t) => t.slug === RAW_DEFAULT_TOPIC)
  ? RAW_DEFAULT_TOPIC
  : "novedades";
export const DEFAULT_AUTHOR = process.env.BLOG_DEFAULT_AUTHOR || "Dr. Omar Orsini";
export const DEFAULT_STATUS: "draft" | "published" =
  process.env.BLOG_DEFAULT_STATUS === "draft" ? "draft" : "published";

/** Max accepted HTML body size (bytes) — guards against abuse/DoS. Real articles are
 *  well under this; kept low to bound worst-case sanitizer work. */
export const MAX_CONTENT_BYTES = 200_000;

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "");
}

/** Map an arbitrary incoming category to one of the site's rendered topics. */
export function normalizeTopic(input: unknown): string {
  if (typeof input !== "string" || !input.trim()) return DEFAULT_TOPIC;
  const key = stripAccents(input.trim().toLowerCase());
  for (const t of KNOWN_TOPICS) {
    if (t.slug === key || t.labels.map(stripAccents).includes(key)) return t.slug;
  }
  return DEFAULT_TOPIC;
}

export function slugify(input: string): string {
  return stripAccents(String(input))
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Parser-based allowlist sanitizer (sanitize-html). Replaces the previous regex
 *  pipeline, which was bypassable (slash-delimited handlers like `<img/src=x/onerror>`,
 *  unquoted and entity-encoded `javascript:` URLs) and quadratic on adversarial input.
 *  A DOM-style parser normalizes markup before filtering, so those classes are closed. */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(String(html ?? ""), {
    allowedTags: [
      "h2", "h3", "h4", "p", "ul", "ol", "li", "a", "strong", "b", "em", "i",
      "u", "s", "blockquote", "img", "figure", "figcaption", "br", "hr",
      "table", "thead", "tbody", "tr", "td", "th", "code", "pre", "span", "sub", "sup",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading", "referrerpolicy"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // Body images must be https (no http/data:); links may also use mailto/tel.
    allowedSchemesByTag: { img: ["https"] },
    allowedSchemesAppliedToAttributes: ["href", "src"],
    disallowedTagsMode: "discard",
    // Bound tree depth so pathologically nested input (e.g. tens of thousands of
    // unclosed tags) can't make sanitization super-linear (DoS).
    nestingLimit: 20,
    transformTags: {
      h1: "h2", // keep a single page-level <h1> (the article title); demote body H1s.
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: { ...attribs, rel: "noopener noreferrer nofollow" },
      }),
      img: (tagName, attribs) => ({
        tagName: "img",
        // no-referrer + lazy: reduce IP-leak / tracking from third-party body images.
        attribs: { ...attribs, loading: "lazy", referrerpolicy: "no-referrer" },
      }),
    },
  });
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** Strip all markup → plain text (for excerpt + reading-time estimation). */
export function htmlToText(html: string): string {
  const text = sanitizeHtml(String(html ?? ""), { allowedTags: [], allowedAttributes: {} });
  return decodeEntities(text).replace(/\s+/g, " ").trim();
}

export function readingTimeFromText(text: string): number {
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.round(words / 200));
}

export function deriveExcerpt(text: string, max = 160): string {
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

type Raw = Record<string, unknown>;

function str(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim();
  if (typeof v === "number") return String(v);
  return undefined;
}

/** First defined string value among the given keys. */
function pick(obj: Raw, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = str(obj[k]);
    if (v !== undefined) return v;
  }
  return undefined;
}

export type NormalizedArticle = {
  slug: string;
  title: string;
  topic: string;
  metaTitle?: string;
  excerpt: string;
  dek?: string;
  bodyHtml: string;
  cover?: string;
  readingTime: number;
  author: string;
  status: "draft" | "published";
  publishedAt?: string;
  faqs: { question: string; answer: string }[];
  tags: string[];
};

function normalizeStatus(obj: Raw): "draft" | "published" {
  const s = pick(obj, ["status", "state", "estado"]);
  if (s) {
    const v = stripAccents(s.toLowerCase());
    if (["draft", "borrador", "unpublished", "pending"].includes(v)) return "draft";
    if (["published", "publicado", "publish", "live"].includes(v)) return "published";
  }
  const flag = obj["publish"] ?? obj["published"] ?? obj["isPublished"];
  if (typeof flag === "boolean") return flag ? "published" : "draft";
  return DEFAULT_STATUS;
}

function normalizeFaqs(obj: Raw): { question: string; answer: string }[] {
  const raw = obj["faqs"] ?? obj["faq"] ?? obj["questions"];
  if (!Array.isArray(raw)) return [];
  const out: { question: string; answer: string }[] = [];
  for (const item of raw) {
    if (out.length >= 30) break; // cap the number of FAQs persisted/rendered
    if (!item || typeof item !== "object") continue;
    const r = item as Raw;
    const q = pick(r, ["question", "q", "pregunta", "title"]);
    const a = pick(r, ["answer", "a", "respuesta", "text", "content"]);
    if (q && a) out.push({ question: q.slice(0, 300), answer: a.slice(0, 2000) });
  }
  return out;
}

/** Normalize tags: accepts an array of strings or a comma-separated string.
 *  Trims, drops empties, dedupes (case-insensitive), caps count and length. */
function normalizeTags(obj: Raw): string[] {
  let raw: unknown = obj["tags"] ?? obj["tag"] ?? obj["keywords"];
  if (typeof raw === "string") raw = raw.split(",");
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    if (out.length >= 20) break;
    const s = (typeof t === "string" ? t : "").trim().slice(0, 50);
    const key = s.toLowerCase();
    if (s && !seen.has(key)) {
      seen.add(key);
      out.push(s);
    }
  }
  return out;
}

/** True when a Supabase error is "column tags does not exist" (DB not yet migrated). */
export function isMissingTagsColumn(error: { message?: string } | null | undefined): boolean {
  return !!error && /column\s.*\btags\b.*\sdoes not exist/i.test(error.message ?? "");
}

function isHttpsUrl(v: string | undefined): boolean {
  if (!v) return false;
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
}

/** Trim a string field to a maximum length (defense-in-depth against oversized input). */
function clamp(s: string | undefined, max: number): string | undefined {
  if (s === undefined) return undefined;
  return s.length > max ? s.slice(0, max).trim() : s;
}

/** Validation error thrown by `normalizePayload` (maps to HTTP 4xx). */
export class PayloadError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Turn a tolerant incoming payload into a validated, normalized article. */
export function normalizePayload(input: unknown): NormalizedArticle {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new PayloadError("El cuerpo debe ser un objeto JSON.");
  }
  const obj = input as Raw;

  const title = pick(obj, ["title", "titulo", "título", "name", "heading"]);
  if (!title) throw new PayloadError("Falta 'title'.");

  const rawHtml = pick(obj, [
    "content", "html", "content_html", "contentHtml", "body_html", "bodyHtml", "body",
  ]);
  if (!rawHtml) throw new PayloadError("Falta 'content' (HTML del artículo).");
  if (Buffer.byteLength(rawHtml, "utf8") > MAX_CONTENT_BYTES) {
    throw new PayloadError("El contenido supera el tamaño máximo permitido.", 413);
  }

  const bodyHtml = sanitizeArticleHtml(rawHtml);
  const plain = htmlToText(bodyHtml);
  if (!plain) throw new PayloadError("El contenido HTML quedó vacío tras la limpieza.");

  const slug = slugify(pick(obj, ["slug", "permalink", "id"]) || title);
  if (!slug) throw new PayloadError("No se pudo derivar un 'slug' válido.");

  const cover = pick(obj, [
    "cover", "image", "coverImage", "cover_image", "featuredImage", "featured_image",
    "imageUrl", "image_url", "thumbnail", "ogImage", "og_image",
  ]);
  if (cover && !isHttpsUrl(cover)) {
    throw new PayloadError("La imagen de portada debe ser una URL https pública.");
  }

  const excerpt =
    pick(obj, [
      "excerpt", "summary", "description", "resumen",
      "seo_description", "seoDescription", "metaDescription", "meta_description",
    ]) || deriveExcerpt(plain);

  const readingTime =
    Number(obj["readingTime"] ?? obj["reading_time"]) > 0
      ? Math.round(Number(obj["readingTime"] ?? obj["reading_time"]))
      : readingTimeFromText(plain);

  const publishedRaw = pick(obj, ["publishedAt", "published_at", "date", "datePublished", "publishDate"]);
  let publishedAt: string | undefined;
  if (publishedRaw) {
    const d = new Date(publishedRaw);
    if (!Number.isNaN(d.getTime())) publishedAt = d.toISOString();
  }

  return {
    slug,
    title: title.slice(0, 300),
    topic: normalizeTopic(pick(obj, ["topic", "category", "categoria", "categoría", "section"])),
    metaTitle: clamp(pick(obj, ["metaTitle", "meta_title", "seoTitle", "seo_title"]), 70),
    excerpt: excerpt.slice(0, 500),
    dek: clamp(pick(obj, ["dek", "subtitle", "subtitulo", "subtítulo", "lead"]), 500),
    bodyHtml,
    cover,
    readingTime,
    author: (pick(obj, ["author", "author_name", "authorName", "byline", "autor"]) || DEFAULT_AUTHOR).slice(0, 120),
    status: normalizeStatus(obj),
    publishedAt,
    faqs: normalizeFaqs(obj),
    tags: normalizeTags(obj),
  };
}
