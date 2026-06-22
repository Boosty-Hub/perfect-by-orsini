import Link from "next/link";

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-xs text-cream-100/60">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {i < items.length - 1 ? (
              <Link href={it.href} className="hover:text-nude-300">
                {it.name}
              </Link>
            ) : (
              <span className="text-cream-100/90">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
