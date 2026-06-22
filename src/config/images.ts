import pexelsData from "@/content/pexels.json";
import techData from "@/content/tech-images.json";
import serviceImgData from "@/content/service-images.json";
import videoData from "@/content/videos.json";

type Video = { slug: string; src: string };
const videoMap: Record<string, string> = Object.fromEntries(
  (videoData as Video[]).map((v) => [v.slug, v.src]),
);

/** Referential header video for a landing, if one exists (Pexels). */
export function serviceVideo(slug: string): string | undefined {
  return videoMap[slug];
}

export const blogVideo: string | undefined = videoMap["blog"];

/**
 * Curated REAL photography from the client's Drive (optimized to /public/img/drive
 * by scripts/pull-assets.mjs). Used for the brand surfaces (home, doctor, about).
 */
export const photos = {
  doctorPortraitCoat: "/img/drive/img-7581.webp",
  doctorPortraitSuit: "/img/drive/img-7585.webp",
  doctorScrubs: "/img/drive/img-7654.webp",
  team: "/img/drive/foto-04.webp",
  teamWide: "/img/drive/foto-01.webp",
  emface: "/img/drive/foto-06.webp",
  emfaceFace: "/img/drive/foto-07.webp",
  exomindBrain: "/img/drive/foto-05.webp",
} as const;

type Pexels = { slug: string; hero: string; ambiance: string };
const pexels = pexelsData as Pexels[];
const pexelsHero: Record<string, string> = Object.fromEntries(pexels.map((p) => [p.slug, p.hero]));
const pexelsAmb: Record<string, string> = Object.fromEntries(pexels.map((p) => [p.slug, p.ambiance]));

// Technology-specific device/treatment images pulled from the previous site
// (scripts/pull-tech-images.mjs). These take priority for technology landings.
type Tech = { slug: string; hero: string; ambiance: string };
const tech = techData as Tech[];
const techHero: Record<string, string> = Object.fromEntries(tech.map((t) => [t.slug, t.hero]));
const techAmb: Record<string, string> = Object.fromEntries(tech.map((t) => [t.slug, t.ambiance]));

// Service-specific images pulled from the published site (cirugías + tratamientos).
const svc = serviceImgData as Tech[];
const svcHero: Record<string, string> = Object.fromEntries(svc.map((s) => [s.slug, s.hero]));
const svcAmb: Record<string, string> = Object.fromEntries(svc.map((s) => [s.slug, s.ambiance]));

// Fallbacks (authentic clinic/team) if a service has no topical image.
const heroPool = [photos.doctorPortraitSuit, photos.team, photos.teamWide, photos.doctorScrubs];
const ambiancePool = [photos.teamWide, photos.team, photos.doctorScrubs];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Hero image: published-site specific (tech or service) → topical Pexels → authentic fallback. */
export function serviceImage(slug: string): string {
  return techHero[slug] ?? svcHero[slug] ?? pexelsHero[slug] ?? heroPool[hash(slug) % heroPool.length];
}

// Real doctor/clinic photos for the "en manos expertas" band (contextual + authentic).
const bandDoctorPool = [photos.doctorScrubs, photos.team, photos.doctorPortraitSuit, photos.teamWide];

/**
 * Mid-page "manos expertas" band image. Always corresponds:
 * - a distinct published 2nd image if the page has one;
 * - else, if the hero is shown as a video, the published procedure/device image;
 * - else (hero already shows the procedure image), a real photo of the surgeon.
 */
export function ambianceImage(slug: string, heroIsVideo = false): string {
  const heroOf = techHero[slug] ?? svcHero[slug];
  const ambOf = techAmb[slug] ?? svcAmb[slug];
  if (ambOf && ambOf !== heroOf) return ambOf;
  if (heroOf) return heroIsVideo ? heroOf : bandDoctorPool[hash(`${slug}-band`) % bandDoctorPool.length];
  return pexelsAmb[slug] ?? ambiancePool[hash(`${slug}-amb`) % ambiancePool.length];
}
