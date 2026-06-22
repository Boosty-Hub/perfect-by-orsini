/**
 * Single source of truth for NAP (Name/Address/Phone), brand and verified credentials.
 * Feeds both the UI and the schema.org JSON-LD layer so they can never drift apart.
 *
 * NOTE (confirm with client before launch): office number "82" had a conflicting
 * snippet ("81"); opening hours and Saturday availability are self-reported.
 */
export const site = {
  name: "Perfect by Dr. Orsini",
  shortName: "Perfect by Orsini",
  url: "https://perfectbyorsini.com",
  locale: "es-VE",
  description:
    "Cirugía plástica y medicina estética en Caracas con el Dr. Omar Orsini, Miembro Titular de la Sociedad Venezolana de Cirugía Plástica (SVCPREM). Procedimientos seguros y resultados naturales.",

  doctor: {
    name: "Dr. Omar Orsini",
    firstName: "Omar",
    lastName: "Orsini",
    title: "Cirujano Plástico",
    // VERIFIED via primary source (SVCPREM official registry). Lead with this.
    society: "Sociedad Venezolana de Cirugía Plástica, Reconstructiva, Estética y Maxilofacial",
    societyAcronym: "SVCPREM",
    memberId: "521",
    credentials:
      "Miembro Titular N.º 521 de la Sociedad Venezolana de Cirugía Plástica, Reconstructiva, Estética y Maxilofacial (SVCPREM)",
    // VERIFIED via primary source (Sociedad Venezolana de Mastología directory).
    additionalMembership: "Miembro de la Sociedad Venezolana de Mastología",
  },

  contact: {
    phone: "+58 (212) 985-7912",
    phoneE164: "+582129857912",
    whatsapp: "+58 (424) 306-4634",
    whatsappE164: "+584243064634",
    email: "secretaria@perfectbyorsini.com",
  },

  address: {
    street: "Centro Comercial Galerías Los Naranjos, Piso 3, Oficina 82",
    neighborhood: "Los Naranjos",
    municipality: "El Hatillo",
    region: "Miranda",
    city: "Caracas",
    countryCode: "VE",
    landmark: "A 5 minutos del pueblo de El Hatillo",
    geo: { lat: 10.4396, lng: -66.8362 },
  },

  hours: {
    label: "Lunes a Viernes, 10:00 – 18:00",
    spec: [{ days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "10:00", closes: "18:00" }],
  },

  social: {
    instagram: "https://www.instagram.com/doctororsini",
    facebook: "https://www.facebook.com/doctororsini",
    twitter: "https://x.com/doctororsini",
  },
} as const;

export type Site = typeof site;
