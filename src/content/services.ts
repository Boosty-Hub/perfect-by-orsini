import type { z } from "zod";
import type { Service } from "@/content/schema";

type ServiceInput = z.input<typeof Service>;

/**
 * Procedure content. Surgery-first batch. Copy is ad-safe (no drug/brand names),
 * answer-first and geo-targeted ("en Caracas"). See docs/CONTENT-GUIDELINES.md.
 */
export const servicesData: ServiceInput[] = [
  {
    slug: "rinoplastia",
    kind: "cirugia",
    specialty: "cirugia-plastica",
    featured: true,
    lastReviewed: "2026-06-21",
    h1: "Rinoplastia en Caracas",
    metaTitle: "Rinoplastia en Caracas | Perfect by Dr. Orsini",
    metaDescription:
      "Rinoplastia estética y funcional en Caracas con el Dr. Omar Orsini, cirujano plástico (SVCPREM). Armonía facial y mejor respiración con seguridad médica.",
    tagline: "Armoniza tu perfil y respira mejor, con un resultado natural.",
    intro:
      "La rinoplastia redefine la forma y la proporción de la nariz para que armonice con el resto de tu rostro. La planificamos de manera personalizada, cuidando tanto la estética como la función respiratoria.",
    whatItIs:
      "Es una cirugía que remodela los huesos y cartílagos de la nariz para mejorar su tamaño, su perfil y su punta. Cuando existe dificultad para respirar, en el mismo acto se puede corregir el tabique y mejorar la función nasal.",
    candidates:
      "Es para ti si sientes que tu nariz no armoniza con tu rostro, no te gusta tu perfil o tienes obstrucción al respirar. Lo ideal es haber completado el crecimiento facial y gozar de buena salud general.",
    procedureTypes: [
      {
        name: "Técnica cerrada o abierta",
        description:
          "Según tu anatomía y el cambio buscado, elegimos un abordaje sin cicatriz externa o uno que permite mayor precisión en la punta.",
      },
      {
        name: "Rinoplastia funcional y estética",
        description:
          "Combina la mejora del perfil con la corrección de la respiración cuando hay desviación del tabique.",
      },
      {
        name: "Rinoplastia secundaria o de revisión",
        description:
          "Para refinar o corregir resultados de una cirugía nasal previa, con una planificación más detallada.",
      },
    ],
    benefits: [
      "Mayor armonía entre la nariz y el resto del rostro",
      "Mejora de la respiración cuando existe obstrucción",
      "Resultados naturales, sin apariencia operada",
      "Plan quirúrgico adaptado a tu anatomía",
    ],
    recovery:
      "La férula se retira hacia la primera semana y el reposo relativo dura pocos días. La mayoría retoma actividad ligera en 1 a 2 semanas; el resultado se afina de forma progresiva durante varios meses.",
    relatedTechnologies: [],
    faqs: [
      {
        question: "¿La rinoplastia es dolorosa?",
        answer:
          "No suele ser una cirugía dolorosa. Es más frecuente la sensación de congestión los primeros días, que se controla con el tratamiento indicado.",
      },
      {
        question: "¿Qué tipo de anestesia se utiliza?",
        answer:
          "Generalmente se realiza con anestesia general en quirófano, acompañada por un anestesiólogo, para tu máxima seguridad y comodidad.",
      },
      {
        question: "¿Cuánto dura la recuperación?",
        answer:
          "La férula se retira alrededor de la primera semana y muchos pacientes vuelven a su rutina ligera en 1 a 2 semanas. El desenlace final se aprecia con el paso de los meses.",
      },
      {
        question: "¿Quedan cicatrices visibles?",
        answer:
          "En la técnica cerrada las incisiones son internas. En la abierta queda una cicatriz mínima en la columela que tiende a volverse casi imperceptible.",
      },
      {
        question: "¿Cuándo veré el resultado definitivo?",
        answer:
          "Verás un cambio notable al retirar la férula, pero el resultado final se consolida a medida que baja la inflamación, durante los meses siguientes.",
      },
      {
        question: "¿Cómo se cotiza una rinoplastia en Caracas?",
        answer:
          "El presupuesto se define en la evaluación médica según tu anatomía y el plan quirúrgico (honorarios, anestesiólogo, quirófano e insumos). Solicítalo sin compromiso.",
      },
    ],
  },

  {
    slug: "mamoplastia",
    kind: "cirugia",
    specialty: "cirugia-plastica",
    featured: true,
    lastReviewed: "2026-06-21",
    h1: "Mamoplastia en Caracas",
    metaTitle: "Mamoplastia en Caracas | Perfect by Dr. Orsini",
    metaDescription:
      "Mamoplastia de aumento, reducción y levantamiento en Caracas con el Dr. Omar Orsini, cirujano plástico (SVCPREM). Resultados naturales y armónicos.",
    tagline: "Forma, volumen y proporción en armonía con tu cuerpo.",
    intro:
      "La mamoplastia agrupa las cirugías que cambian el tamaño, la forma o la posición de las mamas para lograr un contorno equilibrado y natural, acorde a tu silueta.",
    whatItIs:
      "Según tu objetivo, puede aumentar el volumen, reducirlo o reposicionar la mama para devolverle firmeza. La técnica se elige tras una evaluación cuidadosa de tu anatomía y tus expectativas.",
    candidates:
      "Es para ti si deseas más proyección, una reducción que te dé comodidad, o recuperar la posición de la mama tras el embarazo, la lactancia o cambios de peso.",
    procedureTypes: [
      {
        name: "Aumento",
        description:
          "Incrementa el volumen y la proyección buscando una proporción natural con tu tórax.",
      },
      {
        name: "Reducción",
        description:
          "Disminuye el volumen para mejorar la comodidad postural y la armonía corporal.",
      },
      {
        name: "Levantamiento (mastopexia)",
        description:
          "Reposiciona y da firmeza a la mama, con o sin cambio de volumen.",
      },
    ],
    benefits: [
      "Contorno mamario equilibrado y proporcionado",
      "Mejora de la firmeza y la posición",
      "Mayor comodidad cuando hay exceso de volumen",
      "Plan personalizado según tu anatomía",
    ],
    recovery:
      "El reposo inicial es de pocos días, con uso de soporte especial. La actividad ligera suele retomarse en 1 a 2 semanas y el refinamiento del resultado continúa durante los meses siguientes.",
    relatedTechnologies: [],
    faqs: [
      {
        question: "¿Qué anestesia se usa en una mamoplastia?",
        answer:
          "Se realiza en quirófano con anestesia general y acompañamiento de un anestesiólogo, priorizando tu seguridad.",
      },
      {
        question: "¿Cuándo puedo volver a mi rutina?",
        answer:
          "Muchas pacientes retoman actividades ligeras en 1 a 2 semanas. El ejercicio de impacto se reincorpora de forma progresiva según indicación médica.",
      },
      {
        question: "¿La cirugía deja cicatrices?",
        answer:
          "Toda cirugía deja cicatrices; se ubican en zonas discretas y, con los cuidados indicados, tienden a atenuarse con el tiempo.",
      },
      {
        question: "¿El resultado se ve natural?",
        answer:
          "El objetivo es una proporción acorde a tu cuerpo. La técnica y el plan se definen contigo para lograr un resultado armónico.",
      },
      {
        question: "¿Cómo se cotiza la cirugía en Caracas?",
        answer:
          "El presupuesto se establece en la evaluación médica e incluye honorarios, anestesiólogo, quirófano e insumos. Pídelo sin compromiso.",
      },
    ],
  },

  {
    slug: "lipoescultura",
    kind: "cirugia",
    specialty: "cirugia-plastica",
    featured: true,
    lastReviewed: "2026-06-21",
    h1: "Lipoescultura en Caracas",
    metaTitle: "Lipoescultura en Caracas | Perfect by Dr. Orsini",
    metaDescription:
      "Lipoescultura y definición corporal en Caracas con el Dr. Omar Orsini, cirujano plástico (SVCPREM). Contorno armónico y resultados naturales.",
    tagline: "Define tu silueta con un contorno corporal armónico.",
    intro:
      "La lipoescultura remodela el contorno corporal redistribuyendo la grasa localizada para resaltar tus curvas de forma natural y proporcionada.",
    whatItIs:
      "Mediante microcánulas se retira y redefine la grasa de zonas específicas (abdomen, cintura, espalda, flancos) para esculpir una silueta más estilizada. La grasa puede reubicarse para mejorar el contorno.",
    candidates:
      "Es para ti si mantienes un peso estable pero tienes depósitos de grasa localizada que no responden al ejercicio y deseas definir tu silueta.",
    procedureTypes: [
      {
        name: "Lipoescultura de alta definición",
        description:
          "Resalta los contornos musculares naturales para una silueta más marcada.",
      },
      {
        name: "Contorno de cintura y abdomen",
        description:
          "Define la zona media redistribuyendo la grasa de flancos y espalda.",
      },
    ],
    benefits: [
      "Silueta más definida y proporcionada",
      "Reducción de grasa localizada resistente al ejercicio",
      "Contorno natural, adaptado a tu cuerpo",
      "Posibilidad de reubicar grasa para mejorar el contorno",
    ],
    recovery:
      "Se utiliza una faja de compresión las primeras semanas. La actividad ligera se retoma en pocos días y el contorno final se aprecia a medida que disminuye la inflamación, durante varias semanas.",
    relatedTechnologies: [],
    faqs: [
      {
        question: "¿La lipoescultura reemplaza una dieta?",
        answer:
          "No. Es una cirugía de contorno, no un método para bajar de peso. Los mejores resultados se logran con un peso estable y hábitos saludables.",
      },
      {
        question: "¿Necesito usar faja?",
        answer:
          "Sí. La faja de compresión ayuda a moldear el contorno y favorece una mejor recuperación durante las primeras semanas.",
      },
      {
        question: "¿Cuándo veré el resultado?",
        answer:
          "Notarás cambios pronto, pero el contorno definitivo se aprecia cuando la inflamación cede por completo, en el transcurso de varias semanas.",
      },
      {
        question: "¿Cómo se cotiza en Caracas?",
        answer:
          "El presupuesto depende de las zonas a tratar y se define en la evaluación médica (honorarios, anestesiólogo, quirófano e insumos). Solicítalo sin compromiso.",
      },
    ],
  },

  {
    slug: "aumento-de-gluteos",
    kind: "cirugia",
    specialty: "cirugia-plastica",
    featured: true,
    lastReviewed: "2026-06-21",
    h1: "Contorno y aumento de glúteos en Caracas",
    metaTitle: "Aumento de Glúteos en Caracas | Perfect by Dr. Orsini",
    metaDescription:
      "Contorno y aumento de glúteos en Caracas con el Dr. Omar Orsini, cirujano plástico (SVCPREM). Proyección y forma natural con seguridad médica.",
    tagline: "Realza la forma y la proyección con un resultado natural.",
    intro:
      "El contorno de glúteos mejora la forma, el volumen y la proyección de la zona para lograr una silueta equilibrada, respetando siempre tu proporción corporal.",
    whatItIs:
      "El aumento de glúteos con grasa propia es una cirugía que mejora el volumen, la forma y la proyección del glúteo usando la grasa del propio paciente. Primero se obtiene grasa de otras zonas mediante lipoescultura, habitualmente abdomen, cintura o espalda. Luego se procesa y se reinyecta de manera controlada en el glúteo. Así se logra un resultado natural y, a la vez, se afina el contorno corporal. El procedimiento se realiza en quirófano, con anestesia general, y suele durar entre 2 y 4 horas. En la mayoría de los casos es ambulatorio o requiere una noche de hospitalización. El reposo relativo dura pocos días y se usa faja en el postoperatorio. La actividad ligera se retoma de forma progresiva en 1 a 2 semanas. Parte de la grasa reinjertada se reabsorbe los primeros meses; el contorno definitivo se aprecia, en general, hacia los 3 a 6 meses.",
    candidates:
      "Eres buen candidato si deseas más proyección o una mejor forma del glúteo y cuentas con grasa suficiente en otras zonas para reubicarla. También ayuda gozar de buena salud general, mantener un peso estable y tener expectativas realistas. No es la opción ideal si tienes muy poca grasa corporal disponible para el injerto, si fumas de forma activa o si presentas condiciones de salud no controladas. En esos casos pueden valorarse alternativas o cuidados previos. Una evaluación médica confirma si esta técnica es la indicada para ti.",
    procedureTypes: [
      {
        name: "Aumento con grasa propia",
        description:
          "Combina lipoescultura y reubicación de grasa para dar volumen y forma de manera natural.",
      },
      {
        name: "Remodelado de contorno",
        description:
          "Define la transición cintura–cadera–glúteo para una silueta más armónica.",
      },
    ],
    benefits: [
      "Mayor proyección y mejor forma del glúteo",
      "Silueta equilibrada entre cintura, cadera y glúteo",
      "Resultado natural al usar tu propia grasa",
      "Plan adaptado a tu proporción corporal",
    ],
    recovery:
      "Los primeros días se indica reposo relativo y se evita la presión directa sobre los glúteos durante las primeras 2 a 3 semanas, por lo que conviene no sentarse de forma prolongada ni dormir boca arriba. La faja se usa habitualmente entre 4 y 6 semanas para favorecer el contorno. Si hay puntos que retirar, suelen quitarse hacia los 7 a 14 días. La actividad ligera se retoma de manera progresiva en 1 a 2 semanas. El ejercicio de mayor impacto se reincorpora, en general, después de 4 a 6 semanas, según la indicación médica. La inflamación cede a lo largo de las semanas y parte de la grasa se reabsorbe los primeros meses. El resultado se consolida, habitualmente, entre los 3 y los 6 meses.",
    keyFacts: [
      { label: "Duración", value: "2-4 horas" },
      { label: "Anestesia", value: "General" },
      { label: "Hospitalización", value: "Ambulatorio / 1 noche" },
      { label: "Recuperación", value: "1-2 semanas" },
      { label: "Uso de faja", value: "4-6 semanas" },
      { label: "Resultados", value: "3-6 meses" },
    ],
    relatedTechnologies: [],
    faqs: [
      {
        question: "¿Se usa la propia grasa del paciente?",
        answer:
          "Sí. La técnica preferente reubica tu propia grasa, lo que favorece un resultado natural y aprovecha el contorno logrado con la lipoescultura.",
      },
      {
        question: "¿Cuánto cuidado requiere la recuperación?",
        answer:
          "Se recomienda evitar la presión directa sobre los glúteos las primeras semanas y seguir las indicaciones de reposo y faja para optimizar el resultado.",
      },
      {
        question: "¿El resultado es permanente?",
        answer:
          "Parte de la grasa reubicada se estabiliza con el tiempo. Mantener un peso estable ayuda a conservar el contorno logrado.",
      },
      {
        question: "¿Cómo se cotiza en Caracas?",
        answer:
          "El presupuesto se define en la evaluación médica según tu plan (honorarios, anestesiólogo, quirófano e insumos). Pídelo sin compromiso.",
      },
    ],
  },
];
