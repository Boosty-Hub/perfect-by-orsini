"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * Full-bleed background image with a self-playing "pull-back" zoom (Ken Burns).
 * As soon as the section enters view, the image animates from zoomed-in to its
 * natural size — a time-based animation (not tied to scroll) that makes the
 * camera feel like it slowly moves away and reveals more.
 * Respects prefers-reduced-motion (no animation).
 */
export function ParallaxBg({
  src,
  alt = "",
  className = "object-cover",
  from = 1.35,
  duration = 12,
}: {
  src: string;
  alt?: string;
  className?: string;
  from?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={{ scale: reduce ? 1 : from }}
        whileInView={reduce ? undefined : { scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image src={src} alt={alt} fill sizes="100vw" className={className} />
      </motion.div>
    </div>
  );
}
