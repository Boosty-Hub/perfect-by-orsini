import { surgeries, treatments, technologies, serviceHref, shortName } from "@/lib/services";
import { serviceImage } from "@/config/images";
import type { Service } from "@/content/schema";

export type MenuItem = { label: string; href: string; img: string; tagline: string };

const toItem = (s: Service): MenuItem => ({
  label: shortName(s),
  href: serviceHref(s),
  img: serviceImage(s.slug),
  tagline: s.tagline,
});

/** Built on the server, passed to the (client) Navbar as small props so the full
 * catalog JSON is never shipped to the browser. Each item carries its reference image. */
export const megaMenu = {
  cirugias: surgeries.map(toItem),
  tratamientos: treatments.map(toItem),
  tecnologias: technologies.map(toItem),
};

export type MegaKey = keyof typeof megaMenu;
export type MegaMenu = typeof megaMenu;
