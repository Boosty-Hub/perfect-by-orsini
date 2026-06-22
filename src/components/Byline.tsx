import Link from "next/link";

/** E-E-A-T medical-reviewer byline. Leads with the primary-verified credential. */
export function Byline({ date }: { date?: string }) {
  const formatted = date
    ? new Date(date).toLocaleDateString("es-VE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <p className="text-sm text-nude-500">
      Revisado por{" "}
      <Link
        href="/equipo/omar-orsini"
        className="font-medium text-indigo-900 underline-offset-2 hover:underline"
      >
        Dr. Omar Orsini
      </Link>{" "}
      · Cirujano Plástico · Miembro Titular #521 (SVCPREM)
      {formatted && <span className="text-nude-400"> · Actualizado: {formatted}</span>}
    </p>
  );
}
