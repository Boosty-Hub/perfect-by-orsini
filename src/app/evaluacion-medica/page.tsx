import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { whatsappUrl, phoneUrl } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Agenda tu Evaluación Médica en Caracas",
  description:
    "Agenda tu evaluación médica con el Dr. Omar Orsini en Caracas. Una valoración personalizada para definir el plan indicado para ti.",
  alternates: { canonical: "/evaluacion-medica" },
};

const crumbs = [
  { name: "Inicio", href: "/" },
  { name: "Evaluación médica", href: "/evaluacion-medica" },
];

const steps = [
  "Conversamos tus objetivos y tu historia clínica.",
  "El Dr. Orsini valora las opciones seguras para tu caso.",
  "Recibes un plan personalizado y un presupuesto claro.",
];

export default function BookingPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.href })))} />

      <section className="bg-indigo-900 text-cream-50">
        <Container className="py-16">
          <Breadcrumbs items={crumbs} />
          <Reveal>
            <h1 className="mt-6 max-w-3xl text-4xl leading-tight sm:text-5xl">
              Agenda tu evaluación médica
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-cream-100/80">
              Una valoración personalizada con el Dr. Orsini es el primer paso para un resultado
              seguro y natural.
            </p>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={whatsappUrl("Hola, quiero agendar mi evaluación médica.")}>
              Agenda por WhatsApp
            </Button>
            <Button href={phoneUrl} variant="outline">
              Llamar {site.contact.phone}
            </Button>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="max-w-2xl">
          <h2 className="text-2xl text-indigo-900">¿Qué incluye?</h2>
          <ol className="mt-6 space-y-5">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nude-300 text-sm font-medium text-indigo-900">
                  {i + 1}
                </span>
                <p className="pt-1 leading-relaxed text-nude-500">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-nude-200 p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-nude-400">Consulta médica</p>
            <p className="mt-1 font-serif text-4xl text-indigo-900">$100</p>
            <p className="mt-2 text-sm text-nude-500">Nuevo paciente · valoración personalizada.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                href={whatsappUrl("Hola, quiero agendar mi evaluación médica.")}
                className="w-full"
              >
                Agenda por WhatsApp
              </Button>
              <Button href={phoneUrl} variant="dark" className="w-full">
                Llamar ahora
              </Button>
            </div>
            <p className="mt-5 border-t border-nude-200 pt-4 text-xs text-nude-400">
              {site.hours.label}
            </p>
          </div>
        </aside>
      </Container>
    </main>
  );
}
