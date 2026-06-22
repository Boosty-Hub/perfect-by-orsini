import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { topics, getArticlesByTopic, topicMeta } from "@/lib/blog";

export const revalidate = 60;

export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const t = topicMeta(topic);
  if (!t) return {};
  return {
    title: `${t.label} · Blog | Perfect by Dr. Orsini`,
    description: t.desc,
    alternates: { canonical: `/blog/categoria/${t.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const t = topicMeta(topic);
  if (!t) notFound();
  const posts = await getArticlesByTopic(topic);
  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: t.label, href: `/blog/categoria/${t.slug}` },
  ];

  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.href })))} />
      <section className="bg-ink-900 text-cream-50">
        <Container className="py-14">
          <Breadcrumbs items={crumbs} />
          <Reveal>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-nude-300">Blog</p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{t.label}</h1>
            <p className="mt-4 max-w-2xl text-lg text-cream-100/80">{t.desc}</p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-16">
        {posts.length ? (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <StaggerItem key={p.slug}>
                <ArticleCard post={p} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="text-nude-400">Pronto publicaremos artículos en esta categoría.</p>
        )}
      </Container>
    </main>
  );
}
