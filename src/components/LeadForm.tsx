"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { submitLead } from "@/lib/lead-actions";

const inputCls =
  "w-full rounded-xl border border-nude-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-nude-400 focus-visible:border-nude-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nude-300/50";

export function LeadForm({
  source,
  serviceSlug,
  kind,
  interest,
  interestOptions,
  heading = "Solicita tu evaluación",
  intro,
  messagePlaceholder = "Cuéntanos qué te gustaría lograr…",
  className = "",
}: {
  source: string;
  serviceSlug?: string;
  kind?: string;
  /** Pre-filled procedure/area of interest (landings). */
  interest?: string;
  /** If provided, the interest field becomes a select (home / general forms). */
  interestOptions?: string[];
  heading?: string;
  intro?: string;
  messagePlaceholder?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function action(formData: FormData) {
    setStatus("loading");
    setError("");
    const res = await submitLead({
      source,
      serviceSlug,
      kind,
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      interest: String(formData.get("interest") ?? interest ?? ""),
      message: String(formData.get("message") ?? ""),
      pagePath: pathname,
    });
    if (res.ok) setStatus("ok");
    else {
      setStatus("error");
      setError(res.error ?? "No se pudo enviar.");
    }
  }

  if (status === "ok") {
    return (
      <div className={`rounded-3xl border border-nude-200 bg-white p-8 text-center ${className}`}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900 text-cream-50">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="mt-4 font-serif text-2xl text-indigo-900">¡Gracias por escribirnos!</p>
        <p className="mt-2 text-sm text-nude-500">
          Hemos recibido tu solicitud. Nuestro equipo te contactará a la brevedad para coordinar tu
          evaluación con el Dr. Orsini.
        </p>
      </div>
    );
  }

  const loading = status === "loading";

  return (
    <form
      action={action}
      className={`rounded-3xl border border-nude-200 bg-white p-7 sm:p-8 ${className}`}
    >
      <h3 className="font-serif text-2xl text-indigo-900">{heading}</h3>
      {intro && <p className="mt-2 text-sm leading-relaxed text-nude-500">{intro}</p>}

      <div className="mt-6 space-y-3">
        <input name="name" required autoComplete="name" placeholder="Nombre y apellido" className={inputCls} />
        <input name="phone" required inputMode="tel" autoComplete="tel" placeholder="Teléfono / WhatsApp" className={inputCls} />
        <input name="email" type="email" autoComplete="email" placeholder="Correo electrónico (opcional)" className={inputCls} />

        {interestOptions ? (
          <select name="interest" defaultValue="" className={inputCls} aria-label="Procedimiento de interés">
            <option value="" disabled>
              ¿Qué te interesa?
            </option>
            {interestOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
            <option value="Orientación general">No estoy seguro/a — orientación general</option>
          </select>
        ) : interest ? (
          <>
            <input type="hidden" name="interest" value={interest} />
            <p className="rounded-xl bg-cream-100 px-4 py-3 text-sm text-nude-500">
              Te interesa: <span className="font-medium text-indigo-900">{interest}</span>
            </p>
          </>
        ) : (
          <input name="interest" placeholder="Procedimiento de interés" className={inputCls} />
        )}

        <textarea name="message" rows={3} placeholder={messagePlaceholder} className={`${inputCls} resize-none`} />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-indigo-900 px-7 py-3 text-sm font-medium text-cream-50 transition-[colors,transform] duration-200 hover:bg-indigo-800 active:scale-95 disabled:opacity-60"
      >
        {loading ? "Enviando…" : "Enviar solicitud"}
      </button>
      <p className="mt-3 text-center text-xs text-nude-400">
        Al enviar aceptas que el equipo de Perfect by Dr. Orsini te contacte por estos medios.
      </p>
    </form>
  );
}
