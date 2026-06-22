import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";

const nav = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/articulos", label: "Artículos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/paginas", label: "Páginas" },
  { href: "/admin/usuarios", label: "Usuarios", adminOnly: true },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: me } = await sb
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = me?.role === "admin";

  return (
    <div className="flex min-h-screen bg-cream-100 text-ink-900">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-ink-900 p-5 text-cream-50 md:flex">
        <Link href="/" className="font-serif text-lg leading-none">
          Perfect
        </Link>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-nude-300">Panel admin</p>
        <nav className="mt-8 flex flex-col gap-1 text-sm">
          {nav
            .filter((n) => !n.adminOnly || isAdmin)
            .map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-cream-100/80 transition-colors hover:bg-white/5 hover:text-nude-300"
              >
                {n.label}
              </Link>
            ))}
        </nav>
        <form action={signOut} className="mt-auto border-t border-white/10 pt-4">
          <p className="px-3 text-xs text-cream-100/55">{me?.full_name || user.email}</p>
          <p className="px-3 text-[0.65rem] uppercase tracking-wide text-nude-300">{me?.role}</p>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-cream-100/70 hover:bg-white/5"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top nav (the sidebar is hidden below md) */}
        <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-white/10 bg-ink-900 px-4 py-2 text-cream-50 md:hidden">
          <Link href="/admin" className="font-serif text-base">
            Perfect
          </Link>
          <nav className="flex flex-1 gap-1 overflow-x-auto text-xs">
            {nav
              .filter((n) => !n.adminOnly || isAdmin)
              .map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="whitespace-nowrap rounded-lg px-3 py-2 text-cream-100/80 hover:bg-white/5"
                >
                  {n.label}
                </Link>
              ))}
          </nav>
          <form action={signOut}>
            <button type="submit" className="whitespace-nowrap rounded-lg px-3 py-2 text-xs text-cream-100/70">
              Salir
            </button>
          </form>
        </div>
        <main className="flex-1 p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
