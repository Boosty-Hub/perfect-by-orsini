"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

/**
 * Makes its children drift toward the mouse (a soft "image follows the cursor"
 * parallax, like the published site). The inner layer is slightly scaled so the
 * translation never reveals edges inside an overflow-hidden parent.
 * Disabled for prefers-reduced-motion and on touch (no mouse events fire).
 */
export function MouseParallax({
  children,
  strength = 18,
  scale = 1.06,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  strength?: number;
  scale?: number;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 140, damping: 18, mass: 0.4 });
  const x = useTransform(sx, (v) => v * strength);
  const y = useTransform(sy, (v) => v * strength);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={className}>
      <motion.div
        style={{ x, y, scale: reduce ? 1 : scale }}
        className={`h-full w-full will-change-transform ${innerClassName}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
