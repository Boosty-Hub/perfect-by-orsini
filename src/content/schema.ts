import { z } from "zod";

/**
 * Typed content model (validated with Zod). Every page is data; the same entries
 * feed the UI and the schema.org layer.
 *
 * Positioning priority: SURGERIES FIRST, then treatments, technologies, services.
 * `kind` drives nav order, internal-linking weight and sitemap priority.
 */
export const ServiceKind = z.enum(["cirugia", "tratamiento", "tecnologia"]);
export type ServiceKind = z.infer<typeof ServiceKind>;

export const Faq = z.object({
  question: z.string(),
  answer: z.string(),
});
export type Faq = z.infer<typeof Faq>;

export const ProcedureType = z.object({
  name: z.string(),
  description: z.string(),
});

/** A single procedure/treatment page (cirugía, tratamiento o tecnología). */
export const Service = z.object({
  slug: z.string(),
  kind: ServiceKind,
  specialty: z.string(), // Specialty.slug
  // SEO — geo-targeted, ad-safe (see docs/CONTENT-GUIDELINES.md)
  h1: z.string(), // exactly one H1, includes "en Caracas"
  metaTitle: z.string().max(65),
  metaDescription: z.string().max(165),
  tagline: z.string(),
  heroImage: z.string().optional(),
  // Answer-first body (extractable by AI / Google)
  intro: z.string(),
  whatItIs: z.string(),
  candidates: z.string().optional(),
  procedureTypes: z.array(ProcedureType).default([]),
  benefits: z.array(z.string()).default([]),
  recovery: z.string().optional(),
  keyFacts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  faqs: z.array(Faq).default([]),
  // Relations & ranking
  relatedTechnologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  // E-E-A-T
  reviewedBy: z.string().default("Dr. Omar Orsini"),
  lastReviewed: z.string().optional(), // ISO date
});
export type Service = z.infer<typeof Service>;

/** A specialty hub (category landing). */
export const Specialty = z.object({
  slug: z.string(),
  name: z.string(),
  order: z.number(),
  h1: z.string(),
  metaTitle: z.string().max(65),
  metaDescription: z.string().max(165),
  intro: z.string(),
  heroImage: z.string().optional(),
});
export type Specialty = z.infer<typeof Specialty>;

/** A typed content block (no markdown runtime needed).
 *  "html" holds a pre-sanitized rich-HTML body (used by articles published via the API). */
export const Block = z.object({
  type: z.enum(["h2", "p", "ul", "html"]),
  text: z.string().optional(),
  items: z.array(z.string()).optional(),
});
export type Block = z.infer<typeof Block>;

export const BLOG_TOPICS = ["belleza", "novedades", "prevencion"] as const;

/** Blog article. */
export const BlogPost = z.object({
  slug: z.string(),
  title: z.string(),
  topic: z.enum(BLOG_TOPICS),
  metaTitle: z.string().max(70).optional(),
  excerpt: z.string(),
  dek: z.string().optional(), // subtitle/lead
  body: z.array(Block),
  cover: z.string().optional(),
  readingTime: z.number().optional(),
  author: z.string().default("Dr. Omar Orsini"),
  publishedAt: z.string(), // ISO
  updatedAt: z.string().optional(),
  faqs: z.array(Faq).default([]),
  tags: z.array(z.string()).default([]),
});
export type BlogPost = z.infer<typeof BlogPost>;

export function parseService(input: unknown): Service {
  return Service.parse(input);
}
