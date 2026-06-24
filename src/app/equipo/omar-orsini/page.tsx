import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/config/site";
import { photos } from "@/config/images";
import { bookingUrl, whatsappUrl } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Dr. Omar Orsini · Cirujano Plástico en Caracas",
  description:
    "Conoce al Dr. Omar Orsini, cirujano plástico en Caracas y Miembro Titular N.º 521 de la SVCPREM. Trayectoria, formación y enfoque médico.",
  alternates: { canonical: "/equipo/omar-orsini" },
};

const crumbs = [
  { name: "Inicio", href: "/" },
  { name: "El Dr. Orsini", href: "/equipo/omar-orsini" },
];

// VERIFIED (primary source) — safe to state as fact.
const verified = [
  "Miembro Titular N.º 521 de la Sociedad Venezolana de Cirugía Plástica, Reconstructiva, Estética y Maxilofacial (SVCPREM).",
  "Miembro de la Sociedad Venezolana de Mastología.",
];

export default function DoctorPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.href })))} />

      <section className="bg-indigo-900 text-cream-50">
        <Container className="py-14">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <Image
                src="/img/brand/logo-dr-orsini-horizontal-white.png"
                alt="Dr. Orsini"
                width={260}
                height={88}
                priority
                className="mb-7 h-auto w-44 sm:w-52"
              />
              <p className="text-xs uppercase tracking-[0.3em] text-nude-300">
                Cirujano Plástico · Caracas
              </p>
              <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Dr. Omar Orsini</h1>
              <p className="mt-5 max-w-2xl text-lg text-cream-100/80">
                {site.doctor.credentials}.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={bookingUrl}>Agenda tu evaluación</Button>
                <Button href={whatsappUrl()} variant="outline">
                  WhatsApp
                </Button>
              </div>
            </div>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl ring-1 ring-white/10">
              <Image
                src={photos.doctorPortraitCoat}
                alt="Dr. Omar Orsini, cirujano plástico, en su consulta de Caracas"
                fill
                priority
                sizes="(max-width: 1024px) 70vw, 360px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 max-w-2xl">
          <Reveal>
          <h2 className="text-2xl text-indigo-900">Trayectoria y formación</h2>
          {/* Self-reported career details — attributed wording per content policy. */}
          <p className="mt-4 leading-relaxed text-nude-500">
            Según su biografía profesional, el Dr. Omar Orsini se formó como Médico Cirujano en la
            Universidad de Los Andes (Mérida) y realizó el posgrado de Cirugía General en el
            Hospital Domingo Luciani de Caracas. Posteriormente se especializó en Cirugía Plástica,
            Reconstructiva, Estética y Maxilofacial en el Hospital Vargas de Caracas, y amplió su
            formación en cirugía reconstructiva de la mama.
          </p>
          <p className="mt-4 leading-relaxed text-nude-500">
            Con más de 20 años de ejercicio, su práctica se centra en la cirugía plástica, la
            estética facial y el contorno corporal, siempre con un enfoque en la seguridad del
            paciente y resultados naturales planificados de forma personalizada.
          </p>

          <h2 className="mt-12 text-2xl text-indigo-900">Credenciales verificadas</h2>
          <ul className="mt-5 space-y-3">
            {verified.map((v) => (
              <li key={v} className="flex gap-3 text-nude-500">
                <span className="mt-1 text-nude-300">◆</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl text-indigo-900">Filosofía de atención</h2>
          <p className="mt-4 leading-relaxed text-nude-500">
            Cada paciente es único. Por eso el punto de partida siempre es una evaluación médica
            personalizada, donde se conversan los objetivos, se valoran las opciones y se define
            un plan seguro y realista, con acompañamiento en todo el proceso.
          </p>
          </Reveal>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-indigo-900 p-7 text-cream-50">
            <p className="font-serif text-xl">Agenda con el Dr. Orsini</p>
            <p className="mt-2 text-sm text-cream-100/75">
              Una valoración personalizada es el primer paso.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button href={bookingUrl} className="w-full">
                Agenda ahora
              </Button>
              <Button href={whatsappUrl()} variant="outline" className="w-full">
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-nude-200 p-6 text-sm text-nude-500">
            <p className="font-medium text-indigo-900">Síguelo</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={site.social.instagram} className="inline-block py-1.5 hover:text-indigo-900">
                  Instagram @doctororsini
                </a>
              </li>
              <li>
                <a href={site.social.facebook} className="inline-block py-1.5 hover:text-indigo-900">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </Container>
    </main>
  );
}
