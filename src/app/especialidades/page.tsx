import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { specialties } from "@/content/taxonomy";
import { photos } from "@/config/images";

export const metadata: Metadata = {
  title: "Especialidades · Perfect by Dr. Orsini en Caracas",
  description:
    "Cirugía plástica, medicina estética facial y corporal, bienestar, medicina regenerativa y longevidad, y rehabilitación en Caracas.",
  alternates: { canonical: "/especialidades" },
};

const crumbs = [
  { name: "Inicio", href: "/" },
  { name: "Especialidades", href: "/especialidades" },
];

const meta: Record<string, { href: string; img: string; desc: string }> = {
  "cirugia-plastica": {
    href: "/servicios#cirugias",
    img: photos.team,
    desc: "Rinoplastia, mamoplastia, lipoescultura, contorno corporal y más.",
  },
  "medicina-estetica-facial": {
    href: "/servicios#tratamientos",
    img: photos.emfaceFace,
    desc: "Rejuvenecimiento facial y corporal con resultados naturales.",
  },
  "bienestar-y-regeneracion": {
    href: "/servicios#tratamientos",
    img: photos.exomindBrain,
    desc: "Medicina regenerativa, longevidad, bienestar y cuidado integral.",
  },
  rehabilitacion: {
    href: "/servicios#tratamientos",
    img: photos.doctorScrubs,
    desc: "Acompañamiento y recuperación con enfoque médico.",
  },
};

export default function SpecialtiesIndex() {
  return (
    <main>
      <section className="bg-indigo-900 text-cream-50">
        <Container className="py-14">
          <Breadcrumbs items={crumbs} />
          <Reveal>
            <h1 className="mt-6 text-4xl leading-tight sm:text-5xl">Especialidades</h1>
            <p className="mt-4 max-w-2xl text-lg text-cream-100/80">
              Cuatro áreas de atención, lideradas por la cirugía plástica.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-16">
        <Stagger className="grid gap-6 sm:grid-cols-2">
          {[...specialties]
            .sort((a, b) => a.order - b.order)
            .map((sp) => {
              const m = meta[sp.slug];
              return (
                <StaggerItem key={sp.slug}>
                  <Link
                    href={m?.href ?? "/servicios"}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[16/10]"
                  >
                    <Image
                      src={m?.img ?? photos.team}
                      alt={sp.name}
                      fill
                      sizes="(max-width: 640px) 92vw, 560px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-7 text-cream-50">
                      <p className="font-serif text-2xl">{sp.name}</p>
                      <p className="mt-1.5 max-w-md text-sm text-cream-100/80">{m?.desc}</p>
                      <span className="mt-3 inline-block text-sm font-medium text-nude-300">
                        Explorar →
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
        </Stagger>
      </Container>
    </main>
  );
}
