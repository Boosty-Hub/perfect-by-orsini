"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeArticleHtml, isMissingTagsColumn } from "@/lib/blog-publish";

export type ArticlePayload = {
  id?: string;
  slug: string;
  title: string;
  topic: string;
  metaTitle?: string;
  excerpt?: string;
  dek?: string;
  cover?: string;
  readingTime?: number;
  status: "draft" | "published";
  body: { type: "h2" | "p" | "ul" | "html"; text?: string; items?: string[] }[];
  faqs: { question: string; answer: string }[];
  tags?: string[];
};

async function requireUser() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return { sb, user };
}

export async function saveArticle(p: ArticlePayload) {
  const { sb } = await requireUser();
  // Re-sanitize any rich-HTML blocks here too, so the admin save path keeps the same
  // invariant as the publish API (never persist unsanitized HTML to the render path).
  const body = p.body.map((b) =>
    b.type === "html" ? { ...b, text: sanitizeArticleHtml(b.text ?? "") } : b,
  );
  const row = {
    slug: p.slug,
    title: p.title,
    topic: p.topic,
    meta_title: p.metaTitle || null,
    excerpt: p.excerpt || null,
    dek: p.dek || null,
    cover: p.cover || null,
    reading_time: p.readingTime || 4,
    status: p.status,
    body,
    faqs: p.faqs,
    tags: p.tags ?? [],
    published_at: p.status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  let res = p.id
    ? await sb.from("articles").update(row).eq("id", p.id)
    : await sb.from("articles").insert(row);
  // Tolerate a DB without the `tags` migration: retry without tags.
  if (res.error && isMissingTagsColumn(res.error)) {
    const { tags: _omitTags, ...rowNoTags } = row;
    res = p.id
      ? await sb.from("articles").update(rowNoTags).eq("id", p.id)
      : await sb.from("articles").insert(rowNoTags);
  }
  if (res.error) return { error: res.error.message };

  revalidatePath("/blog");
  revalidatePath(`/blog/${p.slug}`);
  revalidatePath("/admin/articulos");
  redirect("/admin/articulos");
}

export async function deleteArticle(id: string, slug: string) {
  const { sb } = await requireUser();
  await sb.from("articles").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/articulos");
}

export async function createUserAccount(_prev: { error?: string }, formData: FormData) {
  const { sb } = await requireUser();
  // Only admins can create users.
  const {
    data: { user },
  } = await sb.auth.getUser();
  const { data: me } = await sb.from("profiles").select("role").eq("id", user!.id).maybeSingle();
  if (me?.role !== "admin") return { error: "Solo un administrador puede crear usuarios." };

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const role = String(formData.get("role") || "editor");
  if (!email || password.length < 8) return { error: "Email válido y contraseña de 8+ caracteres." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}
