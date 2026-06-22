import Image from "next/image";

/**
 * Renders a blog cover that fills its (positioned) parent.
 *
 * Local assets (/img/…) go through next/image (AVIF/WebP + responsive sizing).
 * Remote covers — published via /api/blog/publish from arbitrary external hosts —
 * are rendered with a plain <img> so they do NOT route through /_next/image; this
 * is what lets us drop the wildcard remotePattern that turned the optimizer into an
 * open image proxy. They still load directly in the browser.
 */
export function BlogCover({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const isLocal = src.startsWith("/");
  if (isLocal) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      referrerPolicy="no-referrer"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
