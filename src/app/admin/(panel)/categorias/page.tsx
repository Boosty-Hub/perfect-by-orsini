import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const sb = await createClient();
  const { data } = await sb.from("categories").select("*").order("sort");

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Categorías</h1>
      <p className="mt-1 text-sm text-nude-500">Categorías del blog.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {(data ?? []).map((c) => (
          <div key={c.id} className="rounded-2xl border border-nude-200 bg-white p-5">
            <p className="font-medium text-ink-900">{c.label}</p>
            <p className="mt-1 text-sm text-nude-500">{c.description}</p>
            <p className="mt-3 text-xs text-nude-400">/blog/categoria/{c.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
