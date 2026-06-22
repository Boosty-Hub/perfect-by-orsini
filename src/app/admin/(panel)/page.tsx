import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const sb = await createClient();
  const [{ count: total }, { count: published }, { count: cats }] = await Promise.all([
    sb.from("articles").select("*", { count: "exact", head: true }),
    sb.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    sb.from("categories").select("*", { count: "exact", head: true }),
  ]);
  let userCount = 0;
  try {
    const { data } = await createAdminClient().auth.admin.listUsers();
    userCount = data?.users.length ?? 0;
  } catch {
    /* ignore */
  }

  const stats = [
    { label: "Artículos", value: total ?? 0, href: "/admin/articulos" },
    { label: "Publicados", value: published ?? 0, href: "/admin/articulos" },
    { label: "Categorías", value: cats ?? 0, href: "/admin/categorias" },
    { label: "Usuarios", value: userCount, href: "/admin/usuarios" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Panel</h1>
      <p className="mt-1 text-sm text-nude-500">Gestiona el contenido del sitio.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl bg-white p-6 ring-1 ring-nude-200 transition-all hover:-translate-y-0.5 hover:ring-nude-300"
          >
            <p className="font-serif text-3xl text-ink-900">{s.value}</p>
            <p className="mt-1 text-sm text-nude-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/articulos/nuevo"
          className="rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-cream-50"
        >
          + Nuevo artículo
        </Link>
        <Link
          href="/blog"
          target="_blank"
          className="rounded-full px-6 py-3 text-sm font-medium text-ink-900 ring-1 ring-nude-300"
        >
          Ver el blog →
        </Link>
      </div>
    </div>
  );
}
