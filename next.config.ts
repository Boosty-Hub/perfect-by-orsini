import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Only hosts we control are optimized through /_next/image (NOT a wildcard — that
    // would make the optimizer an open proxy/SSRF surface reachable without auth).
    // Blog covers from arbitrary external hosts (published via the API) are rendered
    // un-optimized by <BlogCover>, so they don't need to be listed here.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      {
        protocol: "https",
        hostname: "imptqjcqfeqcvtqjsbdy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
