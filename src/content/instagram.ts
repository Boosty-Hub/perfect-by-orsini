/**
 * Instagram feed configuration for the home section.
 *
 * A real, auto-updating "latest posts" feed needs the official Instagram Graph
 * API (Business account + token) or a third-party widget — it can't be done in
 * plain code without one. Two ways to make it real here:
 *
 *  1. WIDGET (auto-updating, recommended). Create a free feed at Behold.so,
 *     LightWidget, SnapWidget or EmbedSocial, connect @doctororsini, and paste
 *     the widget's iframe URL below. The latest posts then update on their own.
 *
 *  2. OFFICIAL EMBED (real posts, manual). Paste up to 6 post permalinks below.
 *     They render with Instagram's official embed.js — real posts, no account
 *     needed, but you update the list by hand.
 *
 * If both are empty, the section shows the curated image grid (fallback).
 */
export const instagram = {
  /** Widget iframe URL from LightWidget / SnapWidget / EmbedSocial / Behold. */
  widgetEmbedUrl: "",

  /**
   * Latest @doctororsini posts (official embed.js). Snapshot of 2026-06-21 — this
   * list does NOT auto-update. Refresh it with `node scripts/pull-instagram.mjs`,
   * or switch to a widget (widgetEmbedUrl) for an auto-updating feed.
   */
  posts: [
    "https://www.instagram.com/p/DZ20d8dxcTH/",
    "https://www.instagram.com/p/DZvUAqNCUmH/",
    "https://www.instagram.com/p/DZvLtcERIHQ/",
    "https://www.instagram.com/p/DZuH66kMGRR/",
    "https://www.instagram.com/p/DZXoCWLhGRe/",
    "https://www.instagram.com/p/DZF_iZ6koFf/",
  ] as string[],
};
