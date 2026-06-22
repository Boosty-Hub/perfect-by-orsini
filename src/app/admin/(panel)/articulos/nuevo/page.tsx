import { ArticleEditor } from "@/components/admin/ArticleEditor";

export default function NewArticle() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Nuevo artículo</h1>
      <p className="mt-1 text-sm text-nude-500">Crea y publica una entrada del blog.</p>
      <div className="mt-6">
        <ArticleEditor />
      </div>
    </div>
  );
}
