"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { whatsappUrl } from "@/lib/cta";
import { site } from "@/config/site";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function WaIcon({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="#fff" aria-hidden="true">
      <path d="M16.003 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.46 1.73 6.4L3.2 28.8l6.59-1.72a12.74 12.74 0 0 0 6.21 1.6h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.06-3.63Zm0 23.32h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.91 1.02 1.04-3.81-.25-.4a10.56 10.56 0 0 1-1.62-5.62c0-5.87 4.78-10.65 10.66-10.65 2.85 0 5.52 1.11 7.53 3.12a10.58 10.58 0 0 1 3.12 7.54c0 5.87-4.78 10.65-10.65 10.65Zm5.84-7.98c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.43 5.45 4.81.76.33 1.36.53 1.82.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  const pageUrl = `${site.url}${pathname === "/" ? "" : pathname}`;
  const message = `Hola, me gustaría más información de Perfect by Dr. Orsini.\n\n(Escribo desde: ${pageUrl})`;
  const href = whatsappUrl(message);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="w-72 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/20 ring-1 ring-black/5"
          >
            <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-cream-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <WaIcon size={20} />
              </span>
              <div>
                <p className="text-sm font-medium leading-tight">¡Hola! 👋</p>
                <p className="text-[0.7rem] text-cream-100/80">Perfect by Dr. Orsini</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed text-ink-800">
                ¿Cómo podemos ayudarte? Escríbenos y te respondemos a la brevedad.
              </p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition-[filter,transform] hover:brightness-105 active:scale-95"
              >
                <WaIcon size={18} /> Ir a WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {!reduce && !open && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#25D366]"
            animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
          aria-expanded={open}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/25 transition-transform hover:scale-105 active:scale-95 ${
            open ? "bg-[#0f766e]" : "bg-[#25D366]"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </motion.svg>
            ) : (
              <motion.span
                key="wa"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <WaIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
