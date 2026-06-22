import { site } from "@/config/site";

function Icon({ name }: { name: "instagram" | "facebook" | "x" }) {
  const c = "h-[18px] w-[18px]";
  if (name === "instagram")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={c} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "facebook")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={c} aria-hidden="true">
        <path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.3c0-.8.2-1.3 1.4-1.3h1.4V5.5c-.7-.1-1.4-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H8.4V14h2.2v7h2.9z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={c} aria-hidden="true">
      <path d="M17.5 3H21l-7.3 8.3L22 21h-6.3l-4.9-6.4L5.1 21H1.6l7.8-8.9L2 3h6.5l4.4 5.8L17.5 3zm-1.1 16h1.9L7.7 5H5.7l10.7 14z" />
    </svg>
  );
}

const items = [
  { name: "instagram" as const, label: "Instagram", href: site.social.instagram },
  { name: "facebook" as const, label: "Facebook", href: site.social.facebook },
  { name: "x" as const, label: "X (Twitter)", href: site.social.twitter },
].filter((s) => Boolean(s.href));

export function SocialLinks({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const ring =
    variant === "dark"
      ? "ring-white/15 text-cream-100/80 hover:bg-white/10 hover:text-nude-300"
      : "ring-nude-300 text-indigo-900 hover:bg-nude-200";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {items.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className={`flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-colors ${ring}`}
        >
          <Icon name={s.name} />
        </a>
      ))}
    </div>
  );
}
