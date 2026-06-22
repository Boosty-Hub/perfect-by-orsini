import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { technologies, getService } from "@/lib/services";
import { serviceImage } from "@/config/images";
import { ServiceDetail } from "@/components/ServiceDetail";

export function generateStaticParams() {
  return technologies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s || s.kind !== "tecnologia") return {};
  const url = `/tecnologias-exclusivas/${s.slug}`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      url,
      type: "article",
      images: [serviceImage(s.slug)],
    },
  };
}

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s || s.kind !== "tecnologia") notFound();

  return (
    <ServiceDetail
      service={s}
      section={{ label: "Tecnologías", href: "/servicios#tecnologias" }}
    />
  );
}
