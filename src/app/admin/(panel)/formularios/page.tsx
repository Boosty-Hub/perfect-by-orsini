import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  created_at: string;
  form_source: string;
  service_slug: string | null;
  kind: string | null;
  name: string;
  phone: string;
  email: string | null;
  interest: string | null;
  message: string | null;
  status: string;
};

function fmtDate(s: string) {
  return new Date(s).toLocaleString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function FormulariosPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const sb = await createClient();

  let query = sb.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
  if (source) query = query.eq("form_source", source);
  const { data, error } = await query;
  const leads = (data ?? []) as Lead[];

  const { data: allRows } = await sb.from("leads").select("form_source");
  const sources = [...new Set((allRows ?? []).map((r) => r.form_source as string))].sort();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink-900">Formularios</h1>
          <p className="mt-1 text-sm text-nude-500">
            Leads recibidos desde los formularios del sitio. {leads.length} resultado
            {leads.length === 1 ? "" : "s"}
            {source ? ` · filtro: ${source}` : ""}.
          </p>
        </div>
      </div>

      {sources.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/admin/formularios"
            className={`rounded-full px-3 py-1.5 text-xs ring-1 ${
              !source ? "bg-ink-900 text-cream-50 ring-ink-900" : "ring-nude-300 text-nude-500 hover:bg-nude-200"
            }`}
          >
            Todos
          </Link>
          {sources.map((s) => (
            <Link
              key={s}
              href={`/admin/formularios?source=${encodeURIComponent(s)}`}
              className={`rounded-full px-3 py-1.5 text-xs ring-1 ${
                source === s ? "bg-ink-900 text-cream-50 ring-ink-900" : "ring-nude-300 text-nude-500 hover:bg-nude-200"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudieron cargar los leads: {error.message}
        </p>
      )}

      {leads.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-nude-300 px-6 py-12 text-center text-sm text-nude-500">
          Aún no hay solicitudes. Cuando alguien complete un formulario del sitio, aparecerá aquí.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-nude-200">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-cream-100 text-left text-xs uppercase tracking-wide text-nude-500">
              <tr>
                <th className="p-3 font-medium">Fecha</th>
                <th className="p-3 font-medium">Formulario</th>
                <th className="p-3 font-medium">Nombre</th>
                <th className="p-3 font-medium">Contacto</th>
                <th className="p-3 font-medium">Interés</th>
                <th className="p-3 font-medium">Mensaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nude-200">
              {leads.map((l) => (
                <tr key={l.id} className="align-top">
                  <td className="whitespace-nowrap p-3 text-nude-500">{fmtDate(l.created_at)}</td>
                  <td className="p-3">
                    <span className="inline-block rounded-full bg-indigo-900/10 px-2.5 py-1 text-xs font-medium text-indigo-900">
                      {l.form_source}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-3 font-medium text-ink-900">{l.name}</td>
                  <td className="whitespace-nowrap p-3">
                    <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-indigo-900 hover:underline">
                      {l.phone}
                    </a>
                    {l.email && (
                      <>
                        <br />
                        <a href={`mailto:${l.email}`} className="text-nude-500 hover:underline">
                          {l.email}
                        </a>
                      </>
                    )}
                  </td>
                  <td className="p-3 text-nude-500">{l.interest ?? "—"}</td>
                  <td className="max-w-xs p-3 text-nude-500" title={l.message ?? ""}>
                    {l.message ? (l.message.length > 120 ? l.message.slice(0, 120) + "…" : l.message) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
