import type { ServiceKind } from "./schema";

/**
 * Information architecture. Specialties are the category hubs; each Service
 * belongs to one. Ordered so Cirugía Plástica leads (surgery-first positioning).
 */
export const specialties = [
  { slug: "cirugia-plastica", name: "Cirugía Plástica", order: 1 },
  { slug: "medicina-estetica-facial", name: "Medicina Estética", order: 2 },
  { slug: "bienestar-y-regeneracion", name: "Bienestar, Medicina Regenerativa y Longevidad", order: 3 },
  { slug: "rehabilitacion", name: "Rehabilitación", order: 4 },
] as const;

export type SpecialtySlug = (typeof specialties)[number]["slug"];

/**
 * Sitemap priority + internal-linking weight by kind. Surgeries rank highest
 * because the business wants to position by cirugías first.
 */
export const kindPriority: Record<ServiceKind, number> = {
  cirugia: 1.0,
  tratamiento: 0.8,
  tecnologia: 0.7,
};

export const kindLabel: Record<ServiceKind, string> = {
  cirugia: "Cirugía",
  tratamiento: "Tratamiento",
  tecnologia: "Tecnología",
};
