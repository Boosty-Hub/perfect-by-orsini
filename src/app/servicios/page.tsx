import type { Metadata } from "next";
import Link from "next/link";
import { services, shortName, serviceHref } from "@/lib/services";
import { kindLabel } from "@/content/taxonomy";
import type { ServiceKind } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Cirugías, Tratamientos y Tecnologías en Caracas",
  description:
    "Cirugía plástica, medicina estética y tecnologías de vanguardia en Caracas con el Dr. Omar Orsini, cirujano plástico (SVCPREM).",
  alternates: { canonical: "/servicios" },
};

const groups: { kind: ServiceKind; id: string; title: string; blurb: string }[] = [
  {
    kind: "cirugia",
    id: "cirugias",
    title: "Cirugías",
    blurb: "Procedimientos quirúrgicos para armonizar tu rostro y tu silueta con resultados naturales.",
  },
  {
    kind: "tratamiento",
    id: "tratamientos",
    title: "Tratamientos",
    blurb: "Medicina estética no quirúrgica para cuidar, rejuvenecer y realzar tu belleza natural.",
  },
  {
    kind: "tecnologia",
    id: "tecnologias",
    title: "Tecnologías exclusivas",
    blurb: "Equipos de vanguardia que potencian los resultados de tus tratamientos.",
  },
];

export default function ServicesIndex() {
  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/servicios" },
  ];

  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.href })))} />

      <section className="bg-indigo-900 text-cream-50">
        <Container className="py-14">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight sm:text-5xl">
            Cirugías, tratamientos y tecnologías en Caracas
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-cream-100/80">
            Todo bajo el cuidado del Dr. Omar Orsini, cirujano plástico y Miembro Titular de la
            SVCPREM.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        {groups.map((g) => {
          const items = services.filter((s) => s.kind === g.kind);
          return (
            <section key={g.id} id={g.id} className="scroll-mt-24 py-8">
              <Reveal>
                <h2 className="text-3xl text-indigo-900">{g.title}</h2>
                <p className="mt-2 max-w-2xl text-nude-500">{g.blurb}</p>
              </Reveal>

              {items.length > 0 ? (
                <Stagger className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <StaggerItem key={s.slug}>
                      <Link
                        href={serviceHref(s)}
                        className="group flex h-full flex-col rounded-3xl border border-nude-200 bg-cream-50 p-6 transition-all hover:-translate-y-1 hover:border-nude-300 hover:shadow-lg hover:shadow-indigo-900/5"
                      >
                        <p className="text-xs uppercase tracking-[0.25em] text-nude-400">
                          {kindLabel[s.kind]}
                        </p>
                        <h3 className="mt-2 text-xl text-indigo-900">{shortName(s)}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-nude-500">
                          {s.tagline}
                        </p>
                        <span className="mt-4 inline-block text-sm font-medium text-indigo-900 group-hover:text-nude-400">
                          Ver más →
                        </span>
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : (
                <p className="mt-7 rounded-2xl border border-dashed border-nude-200 p-6 text-sm text-nude-400">
                  En preparación — pronto publicaremos esta sección.
                </p>
              )}
            </section>
          );
        })}
      </Container>
    </main>
  );
}
