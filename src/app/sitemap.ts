import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { services, serviceHref } from "@/lib/services";
import { kindPriority } from "@/content/taxonomy";
import { getArticles, topics } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const now = new Date();

  const staticPages: { url: string; priority: number }[] = [
    { url: base, priority: 1.0 },
    { url: `${base}/servicios`, priority: 0.9 },
    { url: `${base}/especialidades`, priority: 0.7 },
    { url: `${base}/equipo/omar-orsini`, priority: 0.8 },
    { url: `${base}/contacto`, priority: 0.6 },
    { url: `${base}/evaluacion-medica`, priority: 0.7 },
    { url: `${base}/blog`, priority: 0.5 },
  ];

  // Surgeries get the highest priority (positioning).
  const servicePages = services.map((s) => ({
    url: `${base}${serviceHref(s)}`,
    priority: kindPriority[s.kind],
  }));

  const categoryPages = topics.map((t) => ({
    url: `${base}/blog/categoria/${t.slug}`,
    priority: 0.5,
  }));
  const articlePages = (await getArticles()).map((a) => ({
    url: `${base}/blog/${a.slug}`,
    priority: 0.5,
  }));

  return [...staticPages, ...servicePages, ...categoryPages, ...articlePages].map((p) => ({
    url: p.url,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));
}
