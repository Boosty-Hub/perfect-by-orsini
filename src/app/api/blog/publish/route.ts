/**
 * Server-to-server publishing API for the external SEO hub.
 *
 *   POST /api/blog/publish   → create or update (upsert by slug) a blog article
 *   GET  /api/blog/publish   → connection/secret test (publishes nothing)
 *
 * Auth: `Authorization: Bearer <BLOG_PUBLISH_SECRET>` or `x-api-key: <secret>`.
 * Content is sent as HTML; images are public URLs (no binary upload). Re-sending
 * the same slug updates the existing article (upsert).
 */
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/config/site";
import { normalizePayload, PayloadError, isMissingTagsColumn } from "@/lib/blog-publish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

/** Hard cap on the whole request body (defense-in-depth; the HTML field has its own cap). */
const MAX_BODY_BYTES = 1_000_000;

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function bearerOrApiKey(req: Request): string | null {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (m) return m[1].trim();
  const key = req.headers.get("x-api-key");
  return key ? key.trim() : null;
}

/** Returns null when authorized, or an error response when not. */
function checkAuth(req: Request): NextResponse | null {
  const secret = process.env.BLOG_PUBLISH_SECRET;
  if (!secret) {
    // Generic client message; the specific cause is logged server-side only.
    console.error("[blog/publish] BLOG_PUBLISH_SECRET is not set");
    return NextResponse.json({ ok: false, error: "Publicación no disponible." }, { status: 503 });
  }
  const token = bearerOrApiKey(req);
  if (!token || !constantTimeEqual(token, secret)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  return null;
}

export async function GET(req: Request) {
  const denied = checkAuth(req);
  if (denied) return denied;
  return NextResponse.json({
    ok: true,
    test: true,
    service: "perfect-by-orsini blog publish",
    message: "Conexión verificada. Listo para publicar.",
  });
}

export async function POST(req: Request) {
  const denied = checkAuth(req);
  if (denied) return denied;

  // Reject oversized bodies before buffering/parsing (defense-in-depth).
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Cuerpo demasiado grande." }, { status: 413 });
  }

  let json: unknown;
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Cuerpo demasiado grande." }, { status: 413 });
    }
    json = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  // Health check ("Probar conexión"): the hub POSTs an empty body {} with a valid
  // secret and expects a 400 VALIDATION error (not 200, not 500). That falls out
  // naturally below: normalizePayload({}) throws "Falta 'title'." → 400.
  let article;
  try {
    article = normalizePayload(json);
  } catch (e) {
    if (e instanceof PayloadError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: e.status });
    }
    return NextResponse.json({ ok: false, error: "Payload inválido." }, { status: 400 });
  }

  const sb = createAdminClient();

  // Preserve the original publish date across re-publishes (stable dates = better SEO).
  const { data: existing } = await sb
    .from("articles")
    .select("id, published_at")
    .eq("slug", article.slug)
    .maybeSingle();

  const nowIso = new Date().toISOString();
  // Preserve the original publish date across re-publishes AND draft transitions
  // (stable dates = better SEO); only null when the article was never published.
  const publishedAt =
    article.status === "published"
      ? article.publishedAt || existing?.published_at || nowIso
      : (existing?.published_at ?? null);

  const row = {
    slug: article.slug,
    title: article.title,
    topic: article.topic,
    meta_title: article.metaTitle || null,
    excerpt: article.excerpt || null,
    dek: article.dek || null,
    body: [{ type: "html", text: article.bodyHtml }],
    faqs: article.faqs,
    cover: article.cover || null,
    reading_time: article.readingTime,
    status: article.status,
    author_name: article.author,
    tags: article.tags,
    published_at: publishedAt,
    updated_at: nowIso,
  };

  let { data, error } = await sb
    .from("articles")
    .upsert(row, { onConflict: "slug" })
    .select("id, slug")
    .single();

  // Tolerate a DB that hasn't run the `tags` migration yet: retry without tags.
  if (error && isMissingTagsColumn(error)) {
    const { tags: _omitTags, ...rowNoTags } = row;
    ({ data, error } = await sb
      .from("articles")
      .upsert(rowNoTags, { onConflict: "slug" })
      .select("id, slug")
      .single());
  }

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "No se pudo guardar el artículo." },
      { status: 500 },
    );
  }

  // Refresh the affected ISR pages (best effort). The sitemap refreshes via its own
  // `revalidate` window (see app/sitemap.ts) rather than revalidatePath.
  for (const path of ["/blog", `/blog/${article.slug}`, `/blog/categoria/${article.topic}`]) {
    try {
      revalidatePath(path);
    } catch {
      /* revalidation is best-effort */
    }
  }

  return NextResponse.json({
    ok: true,
    action: existing ? "updated" : "created",
    id: data.id,
    slug: data.slug,
    status: article.status,
    url: `${site.url}/blog/${article.slug}`,
  });
}
