import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviciosPages, getService } from "@/lib/services";
import { serviceImage } from "@/config/images";
import { ServiceDetail } from "@/components/ServiceDetail";

export function generateStaticParams() {
  return serviciosPages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s || s.kind === "tecnologia") return {};
  const url = `/servicios/${s.slug}`;
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

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s || s.kind === "tecnologia") notFound();

  const isSurgery = s.kind === "cirugia";
  return (
    <ServiceDetail
      service={s}
      section={{
        label: isSurgery ? "Cirugías" : "Tratamientos",
        href: isSurgery ? "/servicios#cirugias" : "/servicios#tratamientos",
      }}
    />
  );
}
