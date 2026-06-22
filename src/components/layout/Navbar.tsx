"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { bookingUrl } from "@/lib/cta";
import type { MegaMenu, MegaKey, MenuItem } from "@/lib/menu";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cats: { key: MegaKey; label: string; href: string }[] = [
  { key: "cirugias", label: "Cirugías", href: "/servicios#cirugias" },
  { key: "tratamientos", label: "Tratamientos", href: "/servicios#tratamientos" },
  { key: "tecnologias", label: "Tecnologías", href: "/servicios#tecnologias" },
];

const links = [
  { label: "El Dr. Orsini", href: "/equipo/omar-orsini" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

function Wordmark() {
  return (
    <Link href="/" aria-label="Perfect by Dr. Orsini — Inicio" className="block">
      <Image
        src="/img/brand/logo-white.webp"
        alt="Perfect by Dr. Orsini"
        width={132}
        height={46}
        priority
        className="h-9 w-auto"
      />
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  );
}

function MegaPanel({
  items,
  label,
  href,
  onNavigate,
}: {
  items: MenuItem[];
  label: string;
  href: string;
  onNavigate: () => void;
}) {
  return (
    <Container className="py-8">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-serif text-2xl text-cream-50">{label}</p>
        <Link href={href} onClick={onNavigate} className="link-underline text-sm text-nude-300">
          Ver todas →
        </Link>
      </div>
      <motion.ul
        className="grid grid-cols-5 gap-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      >
        {items.map((it) => (
          <motion.li
            key={it.href}
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
            }}
          >
            <Link href={it.href} onClick={onNavigate} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image
                  src={it.img}
                  alt={it.label}
                  fill
                  sizes="220px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent opacity-60 transition-opacity group-hover:opacity-30" />
              </div>
              <p className="mt-2 text-sm text-cream-100/80 transition-colors group-hover:text-nude-300">
                {it.label}
              </p>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </Container>
  );
}

export function Navbar({ megaMenu }: { megaMenu: MegaMenu }) {
  const [active, setActive] = useState<MegaKey | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileCat, setMobileCat] = useState<MegaKey | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (k: MegaKey) => {
    if (timer.current) clearTimeout(timer.current);
    setActive(k);
  };
  const scheduleClose = () => {
    timer.current = setTimeout(() => setActive(null), 130);
  };
  const cancelClose = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  // Close on click; it only reopens when the mouse re-enters a category (onMouseEnter).
  const close = () => {
    if (timer.current) clearTimeout(timer.current);
    setActive(null);
  };

  const activeCat = cats.find((c) => c.key === active);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/5 bg-ink-900/95 backdrop-blur"
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Wordmark />

        <nav className="hidden items-center gap-7 lg:flex">
          {cats.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              onMouseEnter={() => show(c.key)}
              onClick={close}
              className={`link-underline text-sm transition-colors hover:text-nude-300 ${
                active === c.key ? "text-nude-300" : "text-cream-100/80"
              }`}
            >
              {c.label}
            </Link>
          ))}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={scheduleClose}
              className="link-underline text-sm text-cream-100/80 transition-colors hover:text-nude-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href={bookingUrl}>Agenda tu evaluación</Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-cream-50 lg:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Desktop per-section mega menu */}
      <AnimatePresence>
        {activeCat && (
          <motion.div
            key="panel"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute left-0 right-0 top-full hidden border-t border-white/5 bg-ink-950/98 shadow-2xl backdrop-blur lg:block"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <MegaPanel
                  items={megaMenu[activeCat.key]}
                  label={activeCat.label}
                  href={activeCat.href}
                  onNavigate={close}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-ink-900 px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {cats.map((c) => (
              <div key={c.key} className="border-b border-white/5">
                <button
                  type="button"
                  onClick={() => setMobileCat((v) => (v === c.key ? null : c.key))}
                  aria-expanded={mobileCat === c.key}
                  className="flex w-full items-center justify-between py-3 text-left text-cream-100/85"
                >
                  {c.label}
                  <span className={`text-nude-300 transition-transform ${mobileCat === c.key ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {mobileCat === c.key && (
                  <ul className="grid grid-cols-2 gap-2 pb-3">
                    {megaMenu[c.key].map((it) => (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center gap-2 rounded-lg p-2 text-sm text-cream-100/75"
                        >
                          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
                            <Image src={it.img} alt="" fill sizes="36px" className="object-cover" />
                          </span>
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-cream-100/85"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Button href={bookingUrl} className="mt-5 w-full">
            Agenda tu evaluación
          </Button>
        </div>
      )}
    </header>
  );
}
