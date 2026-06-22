import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { HeroMedia } from "@/components/HeroMedia";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticles, topics } from "@/lib/blog";
import { blogVideo } from "@/config/images";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog · Belleza, Novedades y Prevención",
  description:
    "Artículos sobre cirugía plástica, medicina estética y bienestar en Caracas, revisados por el Dr. Omar Orsini.",
  alternates: { canonical: "/blog" },
};

const crumbs = [
  { name: "Inicio", href: "/" },
  { name: "Blog", href: "/blog" },
];

export default async function BlogIndex() {
  const all = await getArticles();
  const poster = all[0]?.cover ?? "/img/pexels/peeling-facial-a.webp";

  return (
    <main>
      <section className="relative h-[58vh] min-h-[420px] overflow-hidden text-cream-50">
        <HeroMedia image={poster} video={blogVideo} alt="" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/50 to-ink-950/40" />
        <Container className="relative flex h-full flex-col justify-end pb-14">
          <Reveal>
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-5 max-w-2xl text-4xl leading-tight sm:text-5xl lg:text-6xl">Blog</h1>
            <p className="mt-4 max-w-xl text-lg text-cream-100/85">
              Belleza, novedades y prevención, con contenido revisado por el Dr. Omar Orsini.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-nude-200 bg-cream-100">
        <Container className="flex flex-wrap gap-3 py-6">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/blog/categoria/${t.slug}`}
              className="rounded-full border border-nude-300/60 px-5 py-2 text-sm text-ink-900 transition-colors hover:border-nude-400 hover:bg-cream-50"
            >
              {t.label}
            </Link>
          ))}
        </Container>
      </section>

      {topics.map((t) => {
        const posts = all.filter((p) => p.topic === t.slug);
        if (!posts.length) return null;
        return (
          <section key={t.slug} className="py-16">
            <Container>
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-nude-400">{t.desc}</p>
                    <h2 className="mt-2 text-3xl text-ink-900">{t.label}</h2>
                  </div>
                  <Link
                    href={`/blog/categoria/${t.slug}`}
                    className="text-sm font-medium text-ink-900 hover:text-nude-400"
                  >
                    Ver todo en {t.label} →
                  </Link>
                </div>
              </Reveal>
              <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <StaggerItem key={p.slug}>
                    <ArticleCard post={p} />
                  </StaggerItem>
                ))}
              </Stagger>
            </Container>
          </section>
        );
      })}
    </main>
  );
}
