import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { bookingUrl, whatsappUrl, phoneUrl, emailUrl } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Contacto · Perfect by Dr. Orsini en Caracas",
  description:
    "Contacta a Perfect by Dr. Orsini en Caracas (El Hatillo). Teléfono, WhatsApp, correo, dirección y horario de atención.",
  alternates: { canonical: "/contacto" },
};

const crumbs = [
  { name: "Inicio", href: "/" },
  { name: "Contacto", href: "/contacto" },
];

export default function ContactPage() {
  const { address } = site;
  const mapSrc = `https://www.google.com/maps?q=${address.geo.lat},${address.geo.lng}&z=15&output=embed`;

  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.href })))} />

      <section className="bg-indigo-900 text-cream-50">
        <Container className="py-14">
          <Breadcrumbs items={crumbs} />
          <Reveal>
            <h1 className="mt-6 text-4xl leading-tight sm:text-5xl">Contacto</h1>
            <p className="mt-4 max-w-2xl text-lg text-cream-100/80">
              Estamos en {address.neighborhood}, {address.municipality}, Caracas. {address.landmark}.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl text-indigo-900">Información de contacto</h2>
          <dl className="mt-6 space-y-5 text-nude-500">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-nude-400">Dirección</dt>
              <dd className="mt-1">
                {address.street}
                <br />
                {address.neighborhood}, {address.municipality}, {address.city}, {address.region}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-nude-400">Teléfono</dt>
              <dd className="mt-1">
                <a href={phoneUrl} className="hover:text-indigo-900">
                  {site.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-nude-400">WhatsApp</dt>
              <dd className="mt-1">
                <a href={whatsappUrl()} className="hover:text-indigo-900">
                  {site.contact.whatsapp}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-nude-400">Correo</dt>
              <dd className="mt-1">
                <a href={emailUrl} className="hover:text-indigo-900">
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-nude-400">Horario</dt>
              <dd className="mt-1">{site.hours.label}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={bookingUrl}>Agenda tu evaluación</Button>
            <Button href={whatsappUrl()} variant="dark">
              WhatsApp
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-nude-200">
          <iframe
            title="Ubicación de Perfect by Dr. Orsini en Caracas"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[420px]"
          />
        </div>
      </Container>
    </main>
  );
}
