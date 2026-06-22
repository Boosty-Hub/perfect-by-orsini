import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { BlogPost, Block, Faq } from "@/content/schema";

/** Anonymous client (no cookies) for public reads — works in generateStaticParams.
 * RLS exposes only published articles to anon. */
function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

export const topics = [
  { slug: "belleza", label: "Belleza", desc: "Realza tu belleza natural con resultados sutiles." },
  { slug: "novedades", label: "Novedades", desc: "Lo último en medicina estética y tecnología." },
  { slug: "prevencion", label: "Prevención", desc: "Cuida tu piel y tu bienestar a tiempo." },
] as const;

export const topicMeta = (t: string) => topics.find((x) => x.slug === t);

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-VE", { year: "numeric", month: "long", day: "numeric" });
}

type Row = {
  slug: string;
  title: string;
  topic: string;
  meta_title: string | null;
  excerpt: string | null;
  dek: string | null;
  body: Block[] | null;
  faqs: Faq[] | null;
  cover: string | null;
  reading_time: number | null;
  author_name: string | null;
  tags: string[] | null;
  published_at: string | null;
};

function toPost(r: Row): BlogPost {
  return {
    slug: r.slug,
    title: r.title,
    topic: r.topic as BlogPost["topic"],
    metaTitle: r.meta_title ?? undefined,
    excerpt: r.excerpt ?? "",
    dek: r.dek ?? undefined,
    body: r.body ?? [],
    faqs: r.faqs ?? [],
    cover: r.cover ?? undefined,
    readingTime: r.reading_time ?? 4,
    author: r.author_name ?? "Dr. Omar Orsini",
    publishedAt: r.published_at ?? "",
    tags: r.tags ?? [],
  };
}

export async function getArticles(): Promise<BlogPost[]> {
  const sb = publicClient();
  const { data } = await sb
    .from("articles")
    .select("*")
    .eq("status", "published")
    // Best-effort scheduling: future-dated articles stay hidden until their time;
    // ISR (revalidate) surfaces them automatically once the date passes.
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  return (data ?? []).map(toPost);
}

export async function getArticlesByTopic(topic: string): Promise<BlogPost[]> {
  const sb = publicClient();
  const { data } = await sb
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("topic", topic)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  return (data ?? []).map(toPost);
}

export async function getArticle(slug: string): Promise<BlogPost | null> {
  const sb = publicClient();
  const { data } = await sb
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return data ? toPost(data as Row) : null;
}
