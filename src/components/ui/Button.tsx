import Link from "next/link";

const variants = {
  primary: "bg-nude-300 text-indigo-900 hover:bg-peach-300",
  outline: "border border-nude-300/50 text-current hover:border-nude-300 hover:bg-white/5",
  dark: "bg-indigo-900 text-cream-50 hover:bg-indigo-800",
  light: "bg-cream-50 text-indigo-900 hover:bg-cream-100",
} as const;

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = `inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3 text-sm font-medium transition-[colors,transform] duration-200 active:scale-95 ${variants[variant]} ${className}`;
  const external = /^(https?:|tel:|mailto:)/.test(href);
  return external ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
