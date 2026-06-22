# Guía de contenido — Perfect by Dr. Orsini

Reglas obligatorias para todo el copy del sitio. Pensadas para **SEO + GEO + elegibilidad en Google Ads** y para cumplir E-E-A-T en contenido médico (YMYL).

## 1. Léxico "ad-safe" (Google Ads + evitar penalización)

No usar en landings marcas ni términos clínicos sensibles que disparan restricciones de Ads o rechazos. Sustituir por lenguaje de **resultado/beneficio**.

| ❌ Evitar | ✅ Usar |
|---|---|
| Botox / toxina botulínica (como gancho) | "suavizado de líneas de expresión", "atenuación de arrugas dinámicas", "rejuvenecimiento facial sin cirugía" |
| Nombres de marcas de fármacos/implantes | descripción genérica del procedimiento y su resultado |
| "relleno/ácido hialurónico" como titular | "armonización facial", "definición y volumen natural" |
| Promesas absolutas: "sin riesgos", "100% seguro", "resultados garantizados" | "procedimiento seguro", "resultados naturales", "evaluación personalizada" |
| "barato", "oferta", precios como gancho clínico | "planes a tu medida", "solicita tu presupuesto" |

- Nada de antes/después que **garantice** un resultado en páginas usadas para Ads.
- Todo procedimiento lleva **disclaimer médico** y sección de recuperación/expectativas realistas.

## 2. Prioridad de posicionamiento: **CIRUGÍAS PRIMERO**

Orden de prioridad en navegación, enlazado interno, profundidad de contenido y `priority` del sitemap:

1. **Cirugías** (`kind: "cirugia"`) — rinoplastia, mamoplastia, lipoescultura, contorno corporal, blefaroplastia, otoplastia, lifting facial, etc. → `priority 1.0`.
2. **Tratamientos** (`kind: "tratamiento"`) → `0.8`.
3. **Tecnologías** (`kind: "tecnologia"`) → `0.7`.
4. **Servicios/otros**.

Las cirugías son las landings canónicas para su intención; las tecnologías enlazan *hacia* las cirugías/condiciones que sirven (hub-and-spoke), no compiten por la misma query.

## 3. Credenciales del Dr. Orsini (YMYL — crítico)

**Verificado con fuente primaria → publicar como hecho y liderar con ello:**
- **Miembro Titular N.º 521 de la SVCPREM** (Soc. Venezolana de Cirugía Plástica, Reconstructiva, Estética y Maxilofacial).
- **Miembro de la Sociedad Venezolana de Mastología.**

**Auto-reportado → SOLO con redacción atribuida** ("según su biografía profesional…"), nunca en JSON-LD como hecho verificado:
- Título médico ULA Mérida; especialización Hospital Vargas (dic. 2007); fellowship Hospital Sírio-Libanês (2014); observership Memorial NY.
- Volumen de casos: usar "más de 20 años de experiencia"; **no** publicar "4.000 casos" (lo contradice el propio sitio actual).

**Refutado / no encontrado → NO publicar nunca:**
- "Dirige/integra la Unidad de Mastología de la Clínica Leopoldo Aguerrevere" (su directorio lo excluye). Sustituir por la membresía SVM verificada.
- Membresías ASPS / ISAPS / FILACP (ausentes de sus padrones). Solo si el cliente aporta certificados.

> El artículo de *El Universal* (2020) es publirreportaje, **no** prensa editorial: no citarlo como autoridad.

## 4. Estructura on-page (answer-first / GEO)

Cada página de servicio sigue: **Qué es → Candidatos → Técnicas → Beneficios → Recuperación → FAQ (8–12) → CTA**. Cada sección abre con una frase-respuesta directa. Un solo `H1` con geo ("… en Caracas"). Byline visible "Revisado por Dr. Omar Orsini · SVCPREM Titular #521" + fecha. Marcado `MedicalProcedure` + `FAQPage`.
