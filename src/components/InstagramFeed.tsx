"use client";

import { useEffect, type ReactNode } from "react";
import { instagram } from "@/content/instagram";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Renders the real Instagram feed when configured (widget iframe or official
 * embed.js posts), otherwise the curated fallback grid. See content/instagram.ts.
 */
export function InstagramFeed({ fallback }: { fallback: ReactNode }) {
  const widget = instagram.widgetEmbedUrl?.trim();
  const posts = (instagram.posts ?? []).slice(0, 6);

  useEffect(() => {
    if (widget || posts.length === 0) return;
    const process = () => window.instgrm?.Embeds?.process();
    const existing = document.getElementById("instagram-embed-js");
    if (existing) {
      process();
      return;
    }
    const s = document.createElement("script");
    s.id = "instagram-embed-js";
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = process;
    document.body.appendChild(s);
  }, [widget, posts.length]);

  if (widget) {
    return (
      <div className="overflow-hidden rounded-2xl ring-1 ring-nude-200">
        <iframe
          src={widget}
          title="Instagram de Perfect by Dr. Orsini"
          className="w-full"
          style={{ minHeight: 640, border: 0 }}
          scrolling="no"
          loading="lazy"
        />
      </div>
    );
  }

  if (posts.length > 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((url) => (
          <blockquote
            key={url}
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ margin: 0, width: "100%", minWidth: 0 }}
          />
        ))}
      </div>
    );
  }

  return <>{fallback}</>;
}
