import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { ArticleBody } from "@/components/ArticleBody";
import { Faqs } from "@/components/Faqs";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { getArticles, getArticle, getArticlesByTopic, topicMeta, formatDate } from "@/lib/blog";
import { bookingUrl } from "@/lib/cta";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  const url = `/blog/${a.slug}`;
  return {
    // Stored meta_title values already include the brand; use `absolute` to avoid
    // doubling it via title.template. When absent, fall back to the bare article
    // title plus a single brand suffix.
    title: { absolute: a.metaTitle ?? `${a.title} | Perfect by Dr. Orsini` },
    description: a.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: a.metaTitle ?? a.title,
      description: a.excerpt,
      url,
      type: "article",
      images: a.cover ? [a.cover] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const t = topicMeta(a.topic);
  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: t?.label ?? "", href: `/blog/categoria/${a.topic}` },
    { name: a.title, href: `/blog/${a.slug}` },
  ];
  const related = (await getArticlesByTopic(a.topic)).filter((r) => r.slug !== a.slug).slice(0, 3);

  return (
    <main>
      <JsonLd
        data={[
          articleSchema(a),
          breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.href }))),
          ...(a.faqs.length ? [faqSchema(a.faqs)] : []),
        ]}
      />

      <section className="bg-ink-900 text-cream-50">
        <Container className="py-12">
          <Breadcrumbs items={crumbs} />
          <Reveal>
            <Link
              href={`/blog/categoria/${a.topic}`}
              className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-nude-300"
            >
              {t?.label}
            </Link>
            <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">{a.title}</h1>
            {a.dek && <p className="mt-4 max-w-2xl text-lg text-cream-100/80">{a.dek}</p>}
            <p className="mt-5 text-sm text-cream-100/60">
              Revisado por Dr. Omar Orsini · {formatDate(a.publishedAt)} · {a.readingTime ?? 4} min de
              lectura
            </p>
          </Reveal>
        </Container>
      </section>

      {a.cover && (
        <div className="relative mx-auto aspect-[4/3] w-full max-w-5xl overflow-hidden sm:aspect-[16/9] md:aspect-[16/7] md:rounded-b-3xl">
          <Image src={a.cover} alt={a.title} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 max-w-2xl">
          <Reveal>
            <ArticleBody blocks={a.body} />
          </Reveal>

          {a.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl text-ink-900">Preguntas frecuentes</h2>
              <div className="mt-5">
                <Faqs items={a.faqs} />
              </div>
            </div>
          )}

          <div className="mt-10">
            <MedicalDisclaimer />
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink-900 p-7 text-cream-50">
            <p className="font-serif text-xl">¿Tienes dudas?</p>
            <p className="mt-2 text-sm text-cream-100/75">
              Agenda una valoración médica personalizada con el Dr. Orsini.
            </p>
            <Button href={bookingUrl} className="mt-5 w-full">
              Agenda tu evaluación
            </Button>
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <section className="bg-cream-100 py-16">
          <Container>
            <h2 className="text-2xl text-ink-900">También te puede interesar</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.slug} post={r} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
