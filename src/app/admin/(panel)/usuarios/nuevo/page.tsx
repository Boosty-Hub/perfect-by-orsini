import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewUserForm } from "@/components/admin/NewUserForm";

export default async function NewUserPage() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const { data: me } = await sb.from("profiles").select("role").eq("id", user!.id).maybeSingle();
  if (me?.role !== "admin") redirect("/admin");

  return (
    <div className="max-w-md">
      <h1 className="font-serif text-3xl text-ink-900">Nuevo usuario</h1>
      <p className="mt-1 text-sm text-nude-500">Crea una cuenta y asígnale un rol.</p>
      <NewUserForm />
    </div>
  );
}
