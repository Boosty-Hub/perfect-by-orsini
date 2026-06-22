import { site } from "@/config/site";
import { surgeries, treatments, technologies, serviceHref, shortName } from "@/lib/services";
import { getArticles } from "@/lib/blog";
import type { Service } from "@/content/schema";

export const revalidate = 3600;

/** llms.txt — a concise, AI-friendly map of the site for generative engines. */
export async function GET() {
  const articles = await getArticles();
  const list = (arr: Service[]) =>
    arr.map((s) => `- [${shortName(s)}](${site.url}${serviceHref(s)}): ${s.tagline}`).join("\n");

  const body = [
    `# ${site.name}`,
    `> Clínica de cirugía plástica y medicina estética en Caracas, Venezuela, dirigida por el Dr. Omar Orsini, cirujano plástico y Miembro Titular N.º 521 de la Sociedad Venezolana de Cirugía Plástica (SVCPREM).`,
    ``,
    `Ubicación: ${site.address.neighborhood}, ${site.address.municipality}, ${site.address.city}, Venezuela. Teléfono ${site.contact.phone}. Horario: ${site.hours.label}.`,
    `Todo el contenido médico es revisado por el Dr. Omar Orsini.`,
    ``,
    `## Cirugías`,
    list(surgeries),
    ``,
    `## Tratamientos`,
    list(treatments),
    ``,
    `## Tecnologías exclusivas`,
    list(technologies),
    ``,
    `## El especialista`,
    `- [Dr. Omar Orsini](${site.url}/equipo/omar-orsini): Cirujano plástico en Caracas, Miembro Titular #521 (SVCPREM) y miembro de la Sociedad Venezolana de Mastología.`,
    ``,
    `## Blog`,
    articles.map((a) => `- [${a.title}](${site.url}/blog/${a.slug}): ${a.excerpt}`).join("\n"),
    ``,
    `## Contacto`,
    `- [Agenda tu evaluación](${site.url}/evaluacion-medica)`,
    `- [Contacto y ubicación](${site.url}/contacto)`,
    ``,
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
