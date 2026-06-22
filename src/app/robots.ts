import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Explicitly welcome AI / generative-engine crawlers (GEO).
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
      { userAgent: aiCrawlers, allow: "/", disallow: "/admin" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
