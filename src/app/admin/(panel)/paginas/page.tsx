import Link from "next/link";

const pages = [
  { label: "Inicio", href: "/" },
  { label: "Servicios (cirugías · tratamientos · tecnologías)", href: "/servicios" },
  { label: "Especialidades", href: "/especialidades" },
  { label: "El Dr. Orsini", href: "/equipo/omar-orsini" },
  { label: "Evaluación médica", href: "/evaluacion-medica" },
  { label: "Contacto", href: "/contacto" },
  { label: "Blog", href: "/blog" },
];

export default function PagesList() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Páginas</h1>
      <p className="mt-1 text-sm text-nude-500">Páginas publicadas del sitio.</p>
      <ul className="mt-6 divide-y divide-nude-200 overflow-hidden rounded-2xl ring-1 ring-nude-200">
        {pages.map((p) => (
          <li key={p.href} className="flex items-center justify-between bg-white p-4">
            <div>
              <p className="font-medium text-ink-900">{p.label}</p>
              <p className="text-xs text-nude-400">{p.href}</p>
            </div>
            <Link
              href={p.href}
              target="_blank"
              className="rounded-full px-4 py-1.5 text-sm text-ink-900 ring-1 ring-nude-300 hover:bg-cream-50"
            >
              Ver →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
