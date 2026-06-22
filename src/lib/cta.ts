import { site } from "@/config/site";

/** WhatsApp click-to-chat URL, optionally pre-filled with a message. */
export const whatsappUrl = (message?: string) =>
  `https://wa.me/${site.contact.whatsappE164.replace("+", "")}` +
  (message ? `?text=${encodeURIComponent(message)}` : "");

export const bookingUrl = "/evaluacion-medica";
export const phoneUrl = `tel:${site.contact.phoneE164}`;
export const emailUrl = `mailto:${site.contact.email}`;

export const defaultWaMessage =
  "Hola, me gustaría agendar una evaluación médica en Perfect by Dr. Orsini.";
