import type { Faq } from "@/content/schema";

/** Visible, expandable FAQ. Pair with faqSchema() for FAQPage JSON-LD. */
export function Faqs({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  return (
    <div className="divide-y divide-nude-200 border-y border-nude-200">
      {items.map((f, i) => (
        <details key={i} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-indigo-900">
            <span>{f.question}</span>
            <span className="shrink-0 text-xl text-nude-400 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-nude-500">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
