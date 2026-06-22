import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, topicMeta } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function ArticlesList() {
  const sb = await createClient();
  const { data } = await sb
    .from("articles")
    .select("id, slug, title, topic, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink-900">Artículos</h1>
        <Link
          href="/admin/articulos/nuevo"
          className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-cream-50"
        >
          + Nuevo
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-nude-200">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-cream-50 text-left text-nude-500">
            <tr>
              <th className="p-3 font-medium">Título</th>
              <th className="p-3 font-medium">Categoría</th>
              <th className="p-3 font-medium">Estado</th>
              <th className="p-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((a) => (
              <tr key={a.id} className="border-t border-nude-200 bg-white hover:bg-cream-50">
                <td className="p-3">
                  <Link
                    href={`/admin/articulos/${a.id}`}
                    className="font-medium text-ink-900 hover:underline"
                  >
                    {a.title}
                  </Link>
                </td>
                <td className="p-3 text-nude-500">{topicMeta(a.topic)?.label ?? a.topic}</td>
                <td className="p-3">
                  {a.status === "published" ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      Publicado
                    </span>
                  ) : (
                    <span className="rounded-full bg-nude-200 px-2 py-0.5 text-xs text-nude-600">
                      Borrador
                    </span>
                  )}
                </td>
                <td className="p-3 text-nude-400">
                  {a.published_at ? formatDate(a.published_at) : "—"}
                </td>
              </tr>
            ))}
            {!data?.length && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-nude-400">
                  Aún no hay artículos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
