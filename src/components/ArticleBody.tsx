import type { Block } from "@/content/schema";

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        if (b.type === "h2")
          return (
            <h2 key={i} className="mt-10 text-2xl text-ink-900">
              {b.text}
            </h2>
          );
        if (b.type === "ul")
          return (
            <ul key={i} className="space-y-2.5">
              {(b.items ?? []).map((it, j) => (
                <li key={j} className="flex gap-3 text-nude-500">
                  <span className="mt-1 text-nude-300">◆</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="leading-relaxed text-nude-500">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}
