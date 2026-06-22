import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/content/schema";
import { getService, serviceHref, shortName, services } from "@/lib/services";
import { kindLabel } from "@/content/taxonomy";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Byline } from "@/components/Byline";
import { Faqs } from "@/components/Faqs";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { JsonLd } from "@/components/JsonLd";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { breadcrumbSchema, procedureSchema, faqSchema } from "@/lib/schema";
import { bookingUrl, whatsappUrl } from "@/lib/cta";
import { site } from "@/config/site";
import { serviceImage, ambianceImage, serviceVideo } from "@/config/images";
import { HeroMedia } from "@/components/HeroMedia";
import { Testimonials } from "@/components/Testimonials";
import { LeadForm } from "@/components/LeadForm";
import { MouseParallax } from "@/components/motion/MouseParallax";

const steps = [
  {
    t: "Evaluación personalizada",
    d: "Conversamos tus objetivos y valoramos tu caso con detalle, sin apuros.",
  },
  {
    t: "Plan a tu medida",
    d: "Diseñamos un plan seguro y realista, pensado para tu anatomía y tus metas.",
  },
  {
    t: "Acompañamiento integral",
    d: "Te guiamos antes, durante y después, con controles en todo el proceso.",
  },
];

const reasons = [
  {
    t: "Cirujano plástico certificado",
    d: "Miembro Titular #521 de la SVCPREM y de la Sociedad Venezolana de Mastología.",
  },
  {
    t: "Más de 20 años de experiencia",
    d: "Enfoque centrado en la seguridad del paciente y los resultados naturales.",
  },
  {
    t: "Atención personalizada en Caracas",
    d: "En El Hatillo, con tecnología de vanguardia y un trato cercano.",
  },
];

export function ServiceDetail({
  service: s,
  section,
}: {
  service: Service;
  section: { label: string; href: string };
}) {
  const name = shortName(s);
  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: section.label, href: section.href },
    { name, href: serviceHref(s) },
  ];

  const related = services
    .filter((r) => r.kind === s.kind && r.slug !== s.slug)
    .slice(0, 4);

  const usedTech = s.relatedTechnologies
    .map((slug) => getService(slug))
    .filter((t): t is Service => Boolean(t));

  const hero = serviceImage(s.slug);
  const video = serviceVideo(s.slug);
  const ambiance = ambianceImage(s.slug, Boolean(video));

  const formCopy: Record<string, { intro: string; ph: string }> = {
    cirugia: {
      intro: `Cuéntanos tu objetivo con tu ${name.toLowerCase()} y te contactamos para coordinar tu evaluación médica con el Dr. Orsini.`,
      ph: `Cuéntanos tu objetivo con tu ${name.toLowerCase()} y desde cuándo lo consideras…`,
    },
    tratamiento: {
      intro: `Déjanos tus datos y te orientamos sobre ${name} según lo que te gustaría mejorar.`,
      ph: "Cuéntanos qué te gustaría mejorar…",
    },
    tecnologia: {
      intro: `¿Te interesa ${name}? Déjanos tus datos y evaluamos juntos si es la mejor opción para ti.`,
      ph: "Cuéntanos qué zona o resultado te interesa…",
    },
  };
  const fc = formCopy[s.kind] ?? formCopy.tratamiento;

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: c.href }))),
          procedureSchema(s),
          ...(s.faqs.length ? [faqSchema(s.faqs)] : []),
        ]}
      />

      {/* Hero (split with image) */}
      <section className="bg-indigo-900 text-cream-50">
        <Container className="grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <Breadcrumbs items={crumbs} />
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-nude-300">
              {kindLabel[s.kind]} · Caracas
            </p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{s.h1}</h1>
            <p className="mt-5 max-w-xl text-lg text-cream-100/80">{s.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={bookingUrl}>Agenda tu evaluación</Button>
              <Button
                href={whatsappUrl(`Hola, me interesa información sobre ${name}.`)}
                variant="outline"
              >
                Escríbenos por WhatsApp
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] ring-1 ring-white/10">
              <MouseParallax className="absolute inset-0" strength={14}>
                <HeroMedia
                  image={hero}
                  video={video}
                  alt={`${name} — Perfect by Dr. Orsini, Caracas`}
                  priority
                />
              </MouseParallax>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Body */}
      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 max-w-2xl">
          <Reveal>
            <Byline date={s.lastReviewed} />
            <p className="mt-6 text-lg leading-relaxed text-nude-500">{s.intro}</p>
          </Reveal>

          {s.keyFacts.length > 0 && (
            <Reveal>
              <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {s.keyFacts.map((k) => (
                  <div key={k.label} className="rounded-xl border border-nude-200 bg-cream-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-nude-400">{k.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink-900">{k.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          <Reveal>
            <h2 className="mt-12 text-2xl text-indigo-900">¿Qué es {name.toLowerCase()}?</h2>
            <p className="mt-4 leading-relaxed text-nude-500">{s.whatItIs}</p>
          </Reveal>

          {s.candidates && (
            <Reveal>
              <h2 className="mt-12 text-2xl text-indigo-900">¿Eres buen candidato?</h2>
              <p className="mt-4 leading-relaxed text-nude-500">{s.candidates}</p>
            </Reveal>
          )}

          {s.procedureTypes.length > 0 && (
            <Reveal>
              <h2 className="mt-12 text-2xl text-indigo-900">Opciones y técnicas</h2>
              <Stagger className="mt-5 space-y-4">
                {s.procedureTypes.map((p) => (
                  <StaggerItem
                    key={p.name}
                    className="rounded-2xl border border-nude-200 p-5 transition-colors hover:border-nude-300"
                  >
                    <h3 className="text-lg text-indigo-900">{p.name}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-nude-500">
                      {p.description}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          )}

          {s.benefits.length > 0 && (
            <Reveal>
              <h2 className="mt-12 text-2xl text-indigo-900">Beneficios</h2>
              <ul className="mt-5 space-y-2.5">
                {s.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-nude-500">
                    <span className="mt-1 text-nude-300">◆</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {s.recovery && (
            <Reveal>
              <h2 className="mt-12 text-2xl text-indigo-900">Recuperación y expectativas</h2>
              <p className="mt-4 leading-relaxed text-nude-500">{s.recovery}</p>
            </Reveal>
          )}

          {usedTech.length > 0 && (
            <Reveal>
              <h2 className="mt-12 text-2xl text-indigo-900">Tecnologías que podemos usar</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {usedTech.map((t) => (
                  <Link
                    key={t.slug}
                    href={serviceHref(t)}
                    className="rounded-full border border-nude-200 px-4 py-2 text-sm text-indigo-900 transition-colors hover:border-nude-300 hover:bg-cream-100"
                  >
                    {shortName(t)}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {s.faqs.length > 0 && (
            <Reveal>
              <h2 className="mt-12 text-2xl text-indigo-900">Preguntas frecuentes</h2>
              <div className="mt-5">
                <Faqs items={s.faqs} />
              </div>
            </Reveal>
          )}

          <div className="mt-10">
            <MedicalDisclaimer />
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-indigo-900 p-7 text-cream-50">
            <p className="font-serif text-xl">Agenda tu evaluación</p>
            <p className="mt-2 text-sm text-cream-100/75">
              Una valoración personalizada con el Dr. Orsini define el plan indicado para ti.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button href={bookingUrl} className="w-full">
                Agenda ahora
              </Button>
              <Button
                href={whatsappUrl(`Hola, me interesa información sobre ${name}.`)}
                variant="outline"
                className="w-full"
              >
                WhatsApp
              </Button>
            </div>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs text-cream-100/60">
              {site.address.neighborhood}, {site.address.municipality} · {site.address.city}
              <br />
              {site.hours.label}
            </p>
          </div>

          {related.length > 0 && (
            <div className="mt-6 rounded-3xl border border-nude-200 p-6">
              <p className="font-medium text-indigo-900">{section.label}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={serviceHref(r)} className="text-nude-500 hover:text-indigo-900">
                      {shortName(r)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>

      {/* Approach / process */}
      <section className="bg-cream-100 py-14 sm:py-20">
        <Container>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-nude-400">Cómo trabajamos</p>
            <h2 className="mt-2 text-3xl text-indigo-900">Nuestro enfoque</h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((st, i) => (
              <StaggerItem
                key={st.t}
                className="rounded-3xl bg-cream-50 p-7 ring-1 ring-nude-200"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900 font-serif text-cream-50">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg text-indigo-900">{st.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nude-500">{st.d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Why Dr. Orsini (image + reasons) */}
      <section className="py-14 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
              <Image
                src={ambiance}
                alt={`${name} — atención estética en Caracas`}
                fill
                sizes="(max-width: 1024px) 92vw, 520px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs uppercase tracking-[0.3em] text-nude-400">Por qué elegirnos</p>
            <h2 className="mt-2 text-3xl text-indigo-900">
              Tu {name.toLowerCase()} en manos expertas
            </h2>
            <ul className="mt-7 space-y-5">
              {reasons.map((r) => (
                <li key={r.t}>
                  <p className="flex items-center gap-2 font-medium text-indigo-900">
                    <span className="text-nude-300">◆</span> {r.t}
                  </p>
                  <p className="mt-1 pl-6 text-sm leading-relaxed text-nude-500">{r.d}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      <Testimonials
        limit={3}
        className="bg-cream-100"
        eyebrow="Experiencias"
        heading="Pacientes que confiaron en nosotros"
      />

      {/* Lead form (personalized to this service) */}
      <section className="py-14 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-nude-400">Da el primer paso</p>
            <h2 className="mt-2 text-4xl text-indigo-900">¿Hablamos sobre tu {name.toLowerCase()}?</h2>
            <p className="mt-4 max-w-md leading-relaxed text-nude-500">{fc.intro}</p>
            <ul className="mt-7 space-y-2.5 text-sm text-nude-500">
              <li>◆ Evaluación con el Dr. Orsini, sin compromiso</li>
              <li>◆ Plan personalizado para tu caso</li>
              <li>◆ Te contactamos a la brevedad</li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <LeadForm
              source={`${kindLabel[s.kind]}: ${name}`}
              serviceSlug={s.slug}
              kind={s.kind}
              interest={name}
              heading={`Solicita información sobre ${name}`}
              intro={`Completa tus datos y te contactamos sobre ${name}.`}
              messagePlaceholder={fc.ph}
            />
          </Reveal>
        </Container>
      </section>

      {/* Final CTA band with image background */}
      <section className="relative overflow-hidden">
        <Image
          src={hero}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-indigo-900/85" />
        <Container className="relative py-20 text-center text-cream-50">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl leading-tight sm:text-4xl">
              Da el primer paso hacia tu {name.toLowerCase()}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream-100/80">
              Agenda una evaluación médica personalizada con el Dr. Orsini en Caracas.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={bookingUrl}>Agenda tu evaluación</Button>
              <Button
                href={whatsappUrl(`Hola, me interesa información sobre ${name}.`)}
                variant="outline"
              >
                WhatsApp
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
