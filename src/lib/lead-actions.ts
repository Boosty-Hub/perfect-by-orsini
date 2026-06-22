"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type LeadInput = {
  source: string;
  serviceSlug?: string;
  kind?: string;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  message?: string;
  pagePath?: string;
  meta?: Record<string, unknown>;
};

/**
 * Stores a form submission as a lead. Called from public client forms as a
 * server action; inserts with the service-role client (bypasses RLS). Leads are
 * readable only by authenticated admins (see scripts/leads.sql).
 */
export async function submitLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  const name = (input.name ?? "").trim();
  const phone = (input.phone ?? "").trim();
  if (name.length < 2) return { ok: false, error: "Por favor escribe tu nombre." };
  if (phone.replace(/\D/g, "").length < 7)
    return { ok: false, error: "Por favor escribe un teléfono válido." };

  try {
    const sb = createAdminClient();
    const { error } = await sb.from("leads").insert({
      form_source: input.source,
      service_slug: input.serviceSlug ?? null,
      kind: input.kind ?? null,
      name,
      phone,
      email: input.email?.trim() || null,
      interest: input.interest?.trim() || null,
      message: input.message?.trim() || null,
      page_path: input.pagePath ?? null,
      meta: input.meta ?? {},
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo enviar. Intenta de nuevo en un momento." };
  }
}
