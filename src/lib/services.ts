import { Service as ServiceSchema, type Service } from "@/content/schema";
import { servicesData } from "@/content/services";
import { catalog } from "@/content/catalog";
import { kindPriority } from "@/content/taxonomy";
import enrichmentData from "@/content/enrichment.json";

type Enrichment = {
  slug: string;
  whatItIs?: string;
  candidates?: string;
  recovery?: string;
  keyFacts?: { label: string; value: string }[];
};
const enrichment: Record<string, Enrichment> = Object.fromEntries(
  (enrichmentData as Enrichment[]).map((e) => [e.slug, e]),
);

/** Validated at module load — a malformed entry fails the build (fail-fast).
 * Citability enrichment (longer self-contained passages + key facts) is layered on top. */
export const services: Service[] = [...servicesData, ...catalog].map((s) => {
  const parsed = ServiceSchema.parse(s);
  const e = enrichment[parsed.slug];
  if (!e) return parsed;
  return {
    ...parsed,
    whatItIs: e.whatItIs ?? parsed.whatItIs,
    candidates: e.candidates ?? parsed.candidates,
    recovery: e.recovery ?? parsed.recovery,
    keyFacts: e.keyFacts ?? parsed.keyFacts,
  };
});

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByKind(kind: Service["kind"]): Service[] {
  return services.filter((s) => s.kind === kind);
}

/** Route for a service: technologies live under their own brand-intent path. */
export function serviceHref(s: Service): string {
  return s.kind === "tecnologia"
    ? `/tecnologias-exclusivas/${s.slug}`
    : `/servicios/${s.slug}`;
}

export const surgeries: Service[] = services.filter((s) => s.kind === "cirugia");
export const treatments: Service[] = services.filter((s) => s.kind === "tratamiento");
export const technologies: Service[] = services.filter((s) => s.kind === "tecnologia");

/** Everything that lives under /servicios (cirugías + tratamientos). */
export const serviciosPages: Service[] = services.filter((s) => s.kind !== "tecnologia");

/** Surgeries first, then treatments, then technologies (positioning priority). */
export const surgeryFirst: Service[] = [...services].sort(
  (a, b) => kindPriority[b.kind] - kindPriority[a.kind],
);

export const featuredSurgeries: Service[] = services.filter(
  (s) => s.kind === "cirugia" && s.featured,
);

/** Short name without the geo suffix, e.g. "Rinoplastia". */
export function shortName(s: Service): string {
  return s.h1.replace(/\s+en Caracas$/i, "");
}
