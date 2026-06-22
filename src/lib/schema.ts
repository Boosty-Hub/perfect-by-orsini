import { site } from "@/config/site";
import type { Service, Faq, BlogPost } from "@/content/schema";

/**
 * schema.org / JSON-LD builders. One @id graph so MedicalClinic, Physician and
 * each MedicalProcedure cross-reference cleanly.
 *
 * CREDENTIAL POLICY (YMYL): only PRIMARY-VERIFIED memberships go into machine-
 * readable `memberOf` (SVCPREM #521, Soc. Venezolana de Mastología). Self-reported
 * items (ULA, Hospital Vargas date, Sírio-Libanês, ASPS/ISAPS/FILACP, case counts)
 * are NEVER emitted as structured facts. See docs/CONTENT-GUIDELINES.md.
 */
const CLINIC_ID = `${site.url}/#clinic`;
const PHYSICIAN_ID = `${site.url}/#physician`;

export function clinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": CLINIC_ID,
    name: site.name,
    url: site.url,
    telephone: site.contact.phoneE164,
    email: site.contact.email,
    image: `${site.url}/og.png`,
    medicalSpecialty: "PlasticSurgery",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.lat,
      longitude: site.address.geo.lng,
    },
    openingHoursSpecification: site.hours.spec.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [site.social.instagram, site.social.facebook, site.social.twitter],
    founder: { "@id": PHYSICIAN_ID },
  };
}

export function physicianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": PHYSICIAN_ID,
    name: site.doctor.name,
    jobTitle: site.doctor.title,
    medicalSpecialty: "PlasticSurgery",
    url: `${site.url}/equipo/omar-orsini`,
    worksFor: { "@id": CLINIC_ID },
    // ONLY primary-verified memberships:
    memberOf: [
      {
        "@type": "MedicalOrganization",
        name: site.doctor.society,
        alternateName: site.doctor.societyAcronym,
      },
      { "@type": "MedicalOrganization", name: "Sociedad Venezolana de Mastología" },
    ],
    sameAs: [site.social.instagram, site.social.facebook, site.social.twitter],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${site.url}${it.url}`,
    })),
  };
}

export function procedureSchema(service: Service) {
  const path = service.kind === "tecnologia" ? "tecnologias-exclusivas" : "servicios";
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.h1,
    description: service.metaDescription,
    url: `${site.url}/${path}/${service.slug}`,
    procedureType:
      service.kind === "cirugia"
        ? "https://schema.org/SurgicalProcedure"
        : "https://schema.org/TherapeuticProcedure",
    provider: { "@id": CLINIC_ID },
    performer: { "@id": PHYSICIAN_ID },
    areaServed: { "@type": "City", name: "Caracas" },
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover ? `${site.url}${post.cover}` : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@id": PHYSICIAN_ID },
    publisher: { "@id": CLINIC_ID },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
