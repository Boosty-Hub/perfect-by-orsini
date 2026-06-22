"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";

/**
 * Hero media that fills its (relative) parent: an autoplaying muted loop video
 * when one is provided, else a next/image. Respects prefers-reduced-motion by
 * falling back to the still image (poster).
 */
export function HeroMedia({
  image,
  video,
  alt,
  priority = false,
  sizes = "(max-width: 1024px) 92vw, 560px",
  className = "object-cover",
}: {
  image: string;
  video?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (video && !reduce) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={image}
        aria-label={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
      >
        <source src={video} type="video/mp4" />
      </video>
    );
  }

  return <Image src={image} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
}
