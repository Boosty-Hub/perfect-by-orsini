"use client";

import { useState, useTransition } from "react";
import { saveArticle, deleteArticle, type ArticlePayload } from "@/app/admin/actions";

const TOPIC_OPTS = [
  { slug: "belleza", label: "Belleza" },
  { slug: "novedades", label: "Novedades" },
  { slug: "prevencion", label: "Prevención" },
];

// "html" blocks are produced by the publish API (rich HTML); the editor can view/edit
// their raw HTML. It is re-sanitized server-side in saveArticle on every save.
type Block = { type: "h2" | "p" | "ul" | "html"; text?: string; items?: string[] };
type Faq = { question: string; answer: string };
type Initial = {
  id?: string;
  slug?: string;
  title?: string;
  topic?: string;
  meta_title?: string;
  excerpt?: string;
  dek?: string;
  cover?: string;
  reading_time?: number;
  status?: string;
  body?: Block[];
  faqs?: Faq[];
  tags?: string[];
};

const inputCls =
  "mt-1 w-full rounded-lg border border-nude-200 bg-white px-3 py-2 text-sm outline-none focus:border-nude-400";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ArticleEditor({ initial }: { initial?: Initial }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [topic, setTopic] = useState(initial?.topic ?? "belleza");
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [dek, setDek] = useState(initial?.dek ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [readingTime, setReadingTime] = useState(initial?.reading_time ?? 4);
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [body, setBody] = useState<Block[]>(
    initial?.body?.length ? initial.body : [{ type: "p", text: "" }],
  );
  const [faqs, setFaqs] = useState<Faq[]>(initial?.faqs ?? []);

  const updateBlock = (i: number, patch: Partial<Block>) =>
    setBody((b) => b.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const addBlock = (type: Block["type"]) =>
    setBody((b) => [...b, type === "ul" ? { type, items: [""] } : { type, text: "" }]);
  const removeBlock = (i: number) => setBody((b) => b.filter((_, j) => j !== i));
  const move = (i: number, dir: number) =>
    setBody((b) => {
      const n = [...b];
      const j = i + dir;
      if (j < 0 || j >= n.length) return n;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  function save(status: "draft" | "published") {
    setErr("");
    if (!title.trim()) {
      setErr("El título es obligatorio.");
      return;
    }
    const cleanBody: Block[] = body
      .map((b) =>
        b.type === "ul"
          ? { type: "ul" as const, items: (b.items ?? []).map((s) => s.trim()).filter(Boolean) }
          : { type: b.type, text: (b.text ?? "").trim() },
      )
      .filter((b) => (b.type === "ul" ? (b.items?.length ?? 0) > 0 : Boolean(b.text)));
    const cleanFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());
    const payload: ArticlePayload = {
      id: initial?.id,
      slug: slug.trim() || slugify(title),
      title: title.trim(),
      topic,
      metaTitle,
      excerpt,
      dek,
      cover,
      readingTime: Number(readingTime) || 4,
      status,
      body: cleanBody,
      faqs: cleanFaqs,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    start(async () => {
      const r = await saveArticle(payload);
      if (r?.error) setErr(r.error);
    });
  }

  function onDelete() {
    if (!initial?.id) return;
    if (!confirm("¿Eliminar este artículo? Esta acción no se puede deshacer.")) return;
    start(async () => {
      await deleteArticle(initial.id!, initial.slug ?? "");
      window.location.href = "/admin/articulos";
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-5">
        <label className="block text-sm font-medium text-ink-900">
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-ink-900">
          Subtítulo (dek)
          <input value={dek} onChange={(e) => setDek(e.target.value)} className={inputCls} />
        </label>

        <div>
          <p className="text-sm font-medium text-ink-900">Contenido</p>
          <div className="mt-2 space-y-3">
            {body.map((b, i) => (
              <div key={i} className="rounded-xl border border-nude-200 bg-white p-3">
                <div className="mb-2 flex items-center gap-2">
                  <select
                    value={b.type}
                    onChange={(e) => updateBlock(i, { type: e.target.value as Block["type"] })}
                    className="rounded-md border border-nude-200 bg-cream-50 px-2 py-1 text-xs"
                  >
                    <option value="h2">Subtítulo</option>
                    <option value="p">Párrafo</option>
                    <option value="ul">Lista</option>
                    <option value="html">HTML</option>
                  </select>
                  <div className="ml-auto flex gap-1 text-nude-500">
                    <button type="button" onClick={() => move(i, -1)} className="flex h-9 w-9 items-center justify-center rounded hover:bg-nude-200 hover:text-ink-900">↑</button>
                    <button type="button" onClick={() => move(i, 1)} className="flex h-9 w-9 items-center justify-center rounded hover:bg-nude-200 hover:text-ink-900">↓</button>
                    <button type="button" onClick={() => removeBlock(i)} className="flex h-9 w-9 items-center justify-center rounded hover:bg-red-50 hover:text-red-600">✕</button>
                  </div>
                </div>
                {b.type === "ul" ? (
                  <textarea
                    rows={4}
                    value={(b.items ?? []).join("\n")}
                    onChange={(e) => updateBlock(i, { items: e.target.value.split("\n") })}
                    placeholder="Un ítem por línea"
                    className="w-full rounded-lg border border-nude-200 px-3 py-2 text-sm outline-none focus:border-nude-400"
                  />
                ) : (
                  <textarea
                    rows={b.type === "h2" ? 1 : b.type === "html" ? 12 : 4}
                    value={b.text ?? ""}
                    onChange={(e) => updateBlock(i, { text: e.target.value })}
                    placeholder={
                      b.type === "html"
                        ? "HTML del artículo (se sanitiza al guardar)"
                        : b.type === "h2"
                          ? "Subtítulo de sección"
                          : "Escribe el párrafo…"
                    }
                    className={`w-full rounded-lg border border-nude-200 px-3 py-2 text-sm outline-none focus:border-nude-400 ${b.type === "html" ? "font-mono text-xs" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button type="button" onClick={() => addBlock("h2")} className="rounded-full border border-nude-200 px-3 py-1.5 hover:border-nude-400">+ Subtítulo</button>
            <button type="button" onClick={() => addBlock("p")} className="rounded-full border border-nude-200 px-3 py-1.5 hover:border-nude-400">+ Párrafo</button>
            <button type="button" onClick={() => addBlock("ul")} className="rounded-full border border-nude-200 px-3 py-1.5 hover:border-nude-400">+ Lista</button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink-900">Preguntas frecuentes</p>
          <div className="mt-2 space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-nude-200 bg-white p-3">
                <input
                  value={f.question}
                  onChange={(e) => setFaqs((x) => x.map((y, j) => (j === i ? { ...y, question: e.target.value } : y)))}
                  placeholder="Pregunta"
                  className="w-full rounded-lg border border-nude-200 px-3 py-2 text-sm outline-none focus:border-nude-400"
                />
                <textarea
                  rows={2}
                  value={f.answer}
                  onChange={(e) => setFaqs((x) => x.map((y, j) => (j === i ? { ...y, answer: e.target.value } : y)))}
                  placeholder="Respuesta"
                  className="mt-2 w-full rounded-lg border border-nude-200 px-3 py-2 text-sm outline-none focus:border-nude-400"
                />
                <button type="button" onClick={() => setFaqs((x) => x.filter((_, j) => j !== i))} className="mt-2 text-xs text-red-600">Quitar</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setFaqs((x) => [...x, { question: "", answer: "" }])} className="mt-3 rounded-full border border-nude-200 px-3 py-1.5 text-xs hover:border-nude-400">+ Pregunta</button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-nude-200 bg-white p-5">
          {err && <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{err}</p>}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => save("published")}
              className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-cream-50 disabled:opacity-60"
            >
              {pending ? "Guardando…" : "Publicar"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => save("draft")}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-ink-900 ring-1 ring-nude-300 disabled:opacity-60"
            >
              Guardar borrador
            </button>
            {initial?.id && (
              <button type="button" onClick={onDelete} className="mt-1 text-xs text-red-600 hover:underline">
                Eliminar artículo
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-nude-200 bg-white p-5 text-sm">
          <label className="block font-medium text-ink-900">
            Categoría
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls}>
              {TOPIC_OPTS.map((t) => (
                <option key={t.slug} value={t.slug}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className="block font-medium text-ink-900">
            Slug (URL)
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="se-genera-del-titulo" className={inputCls} />
          </label>
          <label className="block font-medium text-ink-900">
            Extracto
            <textarea rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputCls} />
          </label>
          <label className="block font-medium text-ink-900">
            Meta título (SEO)
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} />
          </label>
          <label className="block font-medium text-ink-900">
            Etiquetas (separadas por coma)
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="peeling, cuidados" className={inputCls} />
          </label>
          <label className="block font-medium text-ink-900">
            Portada (URL)
            <input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="/img/pexels/…" className={inputCls} />
          </label>
          <label className="block font-medium text-ink-900">
            Min. de lectura
            <input type="number" value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))} className={inputCls} />
          </label>
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="aspect-[16/10] w-full rounded-lg object-cover" />
          )}
        </div>
      </aside>
    </div>
  );
}
