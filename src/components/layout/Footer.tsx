import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { phoneUrl, emailUrl, whatsappUrl } from "@/lib/cta";
import { surgeries, treatments, serviceHref, shortName } from "@/lib/services";

const clinicLinks = [
  { label: "El Dr. Orsini", href: "/equipo/omar-orsini" },
  { label: "Especialidades", href: "/especialidades" },
  { label: "Tecnologías", href: "/servicios#tecnologias" },
  { label: "Blog", href: "/blog" },
  { label: "Evaluación médica", href: "/evaluacion-medica" },
  { label: "Contacto", href: "/contacto" },
];

function LinkCol({
  title,
  links,
  className = "",
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <nav className={`text-sm ${className}`}>
      <p className="mb-3 font-medium text-cream-50">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="transition-colors hover:text-nude-300">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { address } = site;
  const mapSrc = `https://www.google.com/maps?q=${address.geo.lat},${address.geo.lng}&z=15&output=embed`;

  const cirugiaLinks = surgeries.map((s) => ({ label: shortName(s), href: serviceHref(s) }));
  const tratamientoLinks = treatments.map((s) => ({ label: shortName(s), href: serviceHref(s) }));

  return (
    <footer className="bg-indigo-950 text-cream-100/80">
      <div className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-10 px-6 py-14 md:grid-cols-12">
        <div className="md:col-span-3">
          <Image
            src="/img/brand/logo-white.webp"
            alt="Perfect by Dr. Orsini"
            width={160}
            height={56}
            className="h-11 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Cirugía plástica y medicina estética en Caracas. {site.doctor.credentials}.
          </p>
        </div>

        <LinkCol title="Cirugías" links={cirugiaLinks} className="md:col-span-2" />
        <LinkCol title="Tratamientos" links={tratamientoLinks} className="md:col-span-2" />
        <LinkCol title="Clínica" links={clinicLinks} className="md:col-span-2" />

        <div className="text-sm md:col-span-3">
          <p className="mb-3 font-medium text-cream-50">Contacto</p>
          <address className="space-y-2 not-italic leading-relaxed">
            <p>
              {address.street}
              <br />
              {address.neighborhood}, {address.municipality}
              <br />
              {address.city}, {address.region}
            </p>
            <p>
              <a href={phoneUrl} className="hover:text-nude-300">
                {site.contact.phone}
              </a>
            </p>
            <p>
              <a href={whatsappUrl()} className="hover:text-nude-300">
                WhatsApp {site.contact.whatsapp}
              </a>
            </p>
            <p>
              <a href={emailUrl} className="hover:text-nude-300">
                {site.contact.email}
              </a>
            </p>
            <p className="text-cream-100/55">{site.hours.label}</p>
          </address>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${address.geo.lat},${address.geo.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block overflow-hidden rounded-xl ring-1 ring-white/10"
          >
            <iframe
              title="Ubicación de Perfect by Dr. Orsini en Caracas"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none h-40 w-full"
            />
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-5 pb-20 text-xs text-cream-100/45 md:flex-row md:items-center md:justify-between md:pb-5">
          <p className="flex items-center gap-3">
            <span>© {year} Perfect by Dr. Orsini. Todos los derechos reservados.</span>
            <Link href="/admin/login" className="text-cream-100/40 transition-colors hover:text-nude-300">
              Account
            </Link>
          </p>
          <p className="text-[0.8125rem] md:text-xs">
            Este contenido es informativo y no sustituye una consulta médica presencial. Los
            resultados varían según cada paciente. Algunas imágenes son referenciales (Pexels).
          </p>
        </div>
      </div>
    </footer>
  );
}
