import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const { data: me } = await sb.from("profiles").select("role").eq("id", user!.id).maybeSingle();
  if (me?.role !== "admin") redirect("/admin");

  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers();
  const { data: profiles } = await admin.from("profiles").select("id, full_name, role");
  const byId = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink-900">Usuarios</h1>
        <Link
          href="/admin/usuarios/nuevo"
          className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-cream-50"
        >
          + Nuevo
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-nude-200">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-cream-50 text-left text-nude-500">
            <tr>
              <th className="p-3 font-medium">Nombre</th>
              <th className="p-3 font-medium">Correo</th>
              <th className="p-3 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody>
            {(data?.users ?? []).map((u) => (
              <tr key={u.id} className="border-t border-nude-200 bg-white">
                <td className="p-3 font-medium text-ink-900">{byId[u.id]?.full_name || "—"}</td>
                <td className="p-3 text-nude-500">{u.email}</td>
                <td className="p-3">
                  <span className="rounded-full bg-nude-200 px-2 py-0.5 text-xs text-nude-600">
                    {byId[u.id]?.role || "editor"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
