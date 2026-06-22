import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { testimonials as defaultItems, type Testimonial } from "@/content/testimonials";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-nude-400" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 20 20" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.9l-5.1 2.7 1-5.7-4.1-4 5.7-.8L10 1.6z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-nude-200 bg-white p-7">
      <Stars n={t.rating} />
      <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink-800">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 border-t border-nude-200 pt-4">
        <p className="font-medium text-indigo-900">{t.name}</p>
        <p className="text-xs uppercase tracking-wide text-nude-400">{t.procedure}</p>
      </figcaption>
    </figure>
  );
}

export function Testimonials({
  items = defaultItems,
  heading = "Lo que dicen nuestros pacientes",
  eyebrow = "Testimonios",
  limit,
  className = "",
}: {
  items?: Testimonial[];
  heading?: string;
  eyebrow?: string;
  limit?: number;
  className?: string;
}) {
  const list = limit ? items.slice(0, limit) : items;
  if (!list.length) return null;
  return (
    <section className={`py-14 sm:py-20 ${className}`}>
      <Container>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-nude-400">{eyebrow}</p>
          <h2 className="mt-2 text-4xl text-indigo-900">{heading}</h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => (
            <StaggerItem key={t.name + i} className="h-full">
              <Card t={t} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
