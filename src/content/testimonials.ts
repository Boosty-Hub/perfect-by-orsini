export type Testimonial = {
  name: string;
  procedure: string;
  quote: string;
  rating: number;
  /** Set to true ONLY for real, consented testimonials — gates the Review JSON-LD. */
  verified?: boolean;
};

/**
 * ⚠️ PLACEHOLDER TESTIMONIALS. No verifiable Google reviews were found for the
 * clinic. Replace these with REAL, consented patient testimonials (and set
 * `verified: true`) before relying on them. Review schema is emitted only for
 * verified ones. Generic, ad-safe wording (no medical claims/guarantees).
 */
export const testimonials: Testimonial[] = [
  {
    name: "María G.",
    procedure: "Rinoplastia",
    quote:
      "Desde la primera consulta el Dr. Orsini me explicó todo con calma y sin presión. El resultado se ve muy natural y la recuperación fue más llevadera de lo que esperaba.",
    rating: 5,
  },
  {
    name: "Andrés R.",
    procedure: "Atención y seguimiento",
    quote:
      "Un equipo profesional y cercano. Me acompañaron en cada paso y resolvieron todas mis dudas, antes y después del procedimiento.",
    rating: 5,
  },
  {
    name: "Carmen S.",
    procedure: "Medicina estética facial",
    quote:
      "Buscaba algo sutil, no cambiar mi cara, y eso fue justo lo que logramos. Salí feliz y con la piel mucho más luminosa.",
    rating: 5,
  },
  {
    name: "Lucía B.",
    procedure: "Mamoplastia",
    quote:
      "La clínica es moderna y muy cuidada. Lo que más valoro es la honestidad: me recomendaron lo que de verdad necesitaba.",
    rating: 5,
  },
  {
    name: "Daniela P.",
    procedure: "Lipoescultura",
    quote:
      "Resultados naturales y un trato impecable. El seguimiento postoperatorio me dio mucha tranquilidad en todo momento.",
    rating: 5,
  },
  {
    name: "José M.",
    procedure: "Tecnologías estéticas",
    quote:
      "Tecnología de primera y un médico que se toma el tiempo de escucharte. Recomiendo Perfect by Dr. Orsini sin dudarlo.",
    rating: 5,
  },
];
