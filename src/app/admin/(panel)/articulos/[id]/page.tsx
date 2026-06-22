import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const dynamic = "force-dynamic";

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createClient();
  const { data } = await sb.from("articles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Editar artículo</h1>
      <p className="mt-1 text-sm text-nude-500">{data.title}</p>
      <div className="mt-6">
        <ArticleEditor initial={data} />
      </div>
    </div>
  );
}
