import type { Metadata } from "next";

// The whole /admin area is a private CMS (login + panel). Keep it out of search
// indexes: this noindex is inherited by every route under /admin, including the
// "use client" login page (which cannot export metadata itself). Paired with the
// Disallow: /admin rule in robots.ts for defense in depth.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
