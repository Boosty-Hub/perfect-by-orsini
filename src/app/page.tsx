import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ParallaxBg } from "@/components/motion/ParallaxBg";
import { Testimonials } from "@/components/Testimonials";
import { InstagramGrid } from "@/components/InstagramGrid";
import { LeadForm } from "@/components/LeadForm";
import { MouseParallax } from "@/components/motion/MouseParallax";
import { JsonLd } from "@/components/JsonLd";
import {
  featuredSurgeries,
  surgeries,
  treatments,
  technologies,
  shortName,
  serviceHref,
} from "@/lib/services";
import { reviewsSchema } from "@/lib/schema";
import { specialties } from "@/content/taxonomy";
import { testimonials } from "@/content/testimonials";
import { site } from "@/config/site";
import { photos } from "@/config/images";
import { bookingUrl, whatsappUrl } from "@/lib/cta";

const trust = [
  { k: "20+", v: "Años de experiencia" },
  { k: "SVCPREM", v: "Cirujano plástico · Miembro Titular #521" },
  { k: "El Hatillo", v: "Atención personalizada en Caracas" },
];

const specialtyHref: Record<string, string> = {
  "cirugia-plastica": "/servicios#cirugias",
  "medicina-estetica-facial": "/servicios#tratamientos",
  "bienestar-y-regeneracion": "/servicios#tratamientos",
  rehabilitacion: "/servicios#tratamientos",
};

const techTeaser = [
  { title: "EMFACE", img: photos.emface, href: "/tecnologias-exclusivas/emface", note: "Tonificación facial sin agujas" },
  { title: "Exomind", img: photos.exomindBrain, href: "/tecnologias-exclusivas/exomind", note: "Bienestar emocional y mental" },
  { title: "Morpheus8", img: photos.emfaceFace, href: "/tecnologias-exclusivas/morpheus8", note: "Rejuvenecimiento de la piel" },
];

export default function HomePage() {
  const reviews = reviewsSchema(testimonials);
  const interestOptions = [
    ...surgeries.map(shortName),
    ...treatments.map(shortName),
    ...technologies.map(shortName),
  ];
  return (
    <main>
      {reviews && <JsonLd data={reviews} />}
      {/* Hero */}
      <section className="bg-indigo-900 text-cream-50">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:py-28">
          <Reveal>
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-nude-300">
              Caracas · Venezuela
            </p>
            <h1 className="text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Cirugía plástica y medicina estética con resultados naturales
            </h1>
            <p className="mt-7 max-w-xl text-lg text-cream-100/80">
              {site.doctor.name}, {site.doctor.title}. {site.doctor.credentials}.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={bookingUrl}>Agenda tu evaluación</Button>
              <Button href={whatsappUrl()} variant="outline">
                Escríbenos por WhatsApp
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] ring-1 ring-white/10">
              <MouseParallax className="absolute inset-0" strength={16}>
                <Image
                  src={photos.doctorPortraitSuit}
                  alt="Dr. Omar Orsini, cirujano plástico en Caracas"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 400px"
                  className="object-cover object-top"
                />
              </MouseParallax>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="border-b border-nude-200 bg-cream-100">
        <Stagger className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 sm:grid-cols-3">
          {trust.map((t) => (
            <StaggerItem key={t.k} className="text-center sm:text-left">
              <p className="font-serif text-3xl text-indigo-900">{t.k}</p>
              <p className="mt-1 text-sm text-nude-500">{t.v}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Featured surgeries */}
      <section className="py-14 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-nude-400">Nuestra especialidad</p>
                <h2 className="mt-2 text-4xl text-indigo-900">Cirugías</h2>
              </div>
              <Link
                href="/servicios#cirugias"
                className="text-sm font-medium text-indigo-900 hover:text-nude-400"
              >
                Ver todas las cirugías →
              </Link>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSurgeries.map((s) => (
              <StaggerItem key={s.slug}>
                <Link
                  href={serviceHref(s)}
                  className="group flex h-full flex-col rounded-3xl border border-nude-200 p-6 transition-all hover:-translate-y-1 hover:border-nude-300 hover:shadow-lg hover:shadow-indigo-900/5"
                >
                  <h3 className="text-xl text-indigo-900">{shortName(s)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-nude-500">{s.tagline}</p>
                  <span className="mt-5 text-sm font-medium text-indigo-900 group-hover:text-nude-400">
                    Conoce más →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Ambiance band */}
      <section className="relative overflow-hidden">
        <ParallaxBg
          src={photos.team}
          alt="Dr. Omar Orsini y su equipo en Caracas"
          className="object-cover object-[center_22%]"
        />
        <div className="absolute inset-0 bg-indigo-950/75" />
        <Container className="relative py-16 sm:py-24 text-center text-cream-50">
          <Reveal>
            <p className="mx-auto max-w-3xl font-serif text-3xl leading-snug sm:text-4xl">
              Más de 20 años perfeccionando resultados naturales, con la seguridad de un cirujano
              plástico certificado.
            </p>
            <p className="mt-5 text-sm uppercase tracking-[0.3em] text-nude-300">
              Perfect by Dr. Orsini · Caracas
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Specialties */}
      <section className="bg-cream-100 py-14 sm:py-20">
        <Container>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-nude-400">Áreas de atención</p>
            <h2 className="mt-2 text-4xl text-indigo-900">Especialidades</h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...specialties]
              .sort((a, b) => a.order - b.order)
              .map((sp) => (
                <StaggerItem key={sp.slug} className="h-full">
                  <Link
                    href={specialtyHref[sp.slug] ?? "/servicios"}
                    className="group flex h-full flex-col rounded-3xl bg-indigo-900 p-7 text-cream-50 transition-transform hover:-translate-y-1"
                  >
                    <p className="font-serif text-2xl">{sp.name}</p>
                    <span className="mt-auto inline-block pt-6 text-sm text-nude-300">Explorar →</span>
                  </Link>
                </StaggerItem>
              ))}
          </Stagger>
        </Container>
      </section>

      {/* Technologies teaser */}
      <section className="py-14 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-nude-400">Tecnología de vanguardia</p>
                <h2 className="mt-2 text-4xl text-indigo-900">Tecnologías exclusivas</h2>
              </div>
              <Link
                href="/servicios#tecnologias"
                className="text-sm font-medium text-indigo-900 hover:text-nude-400"
              >
                Ver las 11 tecnologías →
              </Link>
            </div>
          </Reveal>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-3">
            {techTeaser.map((t) => (
              <StaggerItem key={t.title}>
                <Link
                  href={t.href}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-3xl"
                >
                  <MouseParallax className="absolute inset-0" strength={12}>
                    <Image
                      src={t.img}
                      alt={t.title}
                      fill
                      sizes="(max-width: 640px) 92vw, 380px"
                      className="object-cover"
                    />
                  </MouseParallax>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/30 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-cream-50">
                    <p className="font-serif text-xl">{t.title}</p>
                    <p className="mt-1 text-xs text-cream-100/80">{t.note}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Doctor authority */}
      <section className="bg-cream-100 py-14 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-nude-400">El especialista</p>
            <h2 className="mt-2 text-4xl text-indigo-900">{site.doctor.name}</h2>
            <p className="mt-5 leading-relaxed text-nude-500">
              Cirujano plástico en Caracas con más de 20 años de experiencia, Miembro Titular
              N.º 521 de la Sociedad Venezolana de Cirugía Plástica, Reconstructiva, Estética y
              Maxilofacial (SVCPREM) y miembro de la Sociedad Venezolana de Mastología. Su enfoque
              prioriza la seguridad y los resultados naturales, planificados de forma personalizada.
            </p>
            <ul className="mt-8 space-y-2.5 text-sm text-nude-500">
              <li>◆ Miembro Titular #521 — SVCPREM</li>
              <li>◆ Miembro de la Sociedad Venezolana de Mastología</li>
              <li>◆ Más de 20 años de experiencia quirúrgica</li>
              <li>◆ Enfoque en seguridad y resultados naturales</li>
            </ul>
            <div className="mt-8">
              <Button href="/equipo/omar-orsini" variant="dark">
                Conoce al Dr. Orsini
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
              <Image
                src={photos.teamWide}
                alt="Dr. Omar Orsini y su equipo en la clínica de Caracas"
                fill
                sizes="(max-width: 1024px) 90vw, 600px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Instagram */}
      <InstagramGrid />

      {/* Lead form */}
      <section className="py-14 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-nude-400">Agenda tu evaluación</p>
            <h2 className="mt-2 text-4xl text-indigo-900">Cuéntanos qué te gustaría mejorar</h2>
            <p className="mt-4 max-w-md leading-relaxed text-nude-500">
              Déjanos tus datos y el procedimiento que te interesa. Nuestro equipo te contactará para
              coordinar una evaluación personalizada con el Dr. Orsini en Caracas.
            </p>
            <ul className="mt-7 space-y-2.5 text-sm text-nude-500">
              <li>◆ Atención personalizada y sin compromiso</li>
              <li>◆ Cirujano plástico certificado (SVCPREM #521)</li>
              <li>◆ Te contactamos a la brevedad</li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <LeadForm
              source="Home"
              kind="home"
              interestOptions={interestOptions}
              heading="Solicita tu evaluación"
              messagePlaceholder="Cuéntanos qué te gustaría mejorar o lograr…"
            />
          </Reveal>
        </Container>
      </section>

      {/* CTA band */}
      <section className="bg-indigo-900 text-cream-50">
        <Container className="flex flex-col items-center py-14 sm:py-20 text-center">
          <Reveal>
            <h2 className="max-w-2xl text-4xl leading-tight">
              Da el primer paso hacia tu mejor versión
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream-100/80">
              Agenda una evaluación médica personalizada y conversemos sobre tus objetivos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={bookingUrl}>Agenda tu evaluación</Button>
              <Button href={whatsappUrl()} variant="outline">
                WhatsApp
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
