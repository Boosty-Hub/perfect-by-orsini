# Perfect by Dr. Orsini — Sitio web

Sitio de **Perfect by Dr. Orsini**, clínica de cirugía plástica y medicina estética en Caracas (Dr. Omar Orsini). Reconstrucción del sitio Webflow original, optimizada para **SEO y GEO** (visibilidad en buscadores y en motores de IA: ChatGPT, Perplexity, Google AI Overviews).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (config CSS-first en `src/app/globals.css` con `@theme`)
- **Framer Motion** (`motion`) para animaciones
- **Zod 4** para validar el contenido tipado
- **Supabase** (Postgres + Auth) para el CMS/blog · **sharp** para optimización de imágenes
- Contenido SSG/ISR; deploy pensado para Vercel/Netlify

## Comandos

```bash
pnpm dev            # desarrollo (localhost:3000)
pnpm build          # build de producción (valida TS + genera estáticos)
pnpm start          # servir build
node scripts/pull-assets.mjs          # baja/optimiza fotos del Drive del cliente
node scripts/pull-service-images.mjs  # imágenes por servicio (sitio publicado)
node scripts/pull-tech-images.mjs     # imágenes por tecnología (sitio publicado)
node scripts/pull-pexels.mjs          # PEXELS_API_KEY=... imágenes referenciales
node scripts/pull-pexels-videos.mjs   # PEXELS_API_KEY=... videos de header
node scripts/seed-articles.mjs        # siembra los artículos del blog en Supabase
node scripts/db-query.mjs scripts/schema.sql  # corre SQL en Supabase (Management API)
```

## Estructura

```
src/
  app/
    layout.tsx              # shell raíz: fuentes, metadata/OG, JsonLd sitewide, ChromeGate
    page.tsx                # home
    servicios/[slug]        # cirugías + tratamientos (kind cirugia|tratamiento)
    tecnologias-exclusivas/[slug]   # tecnologías (kind tecnologia)
    especialidades, equipo/omar-orsini, contacto, evaluacion-medica
    blog/                   # índice + categoria/[topic] + [slug]  (lee de Supabase, ISR)
    admin/                  # CMS: login + (panel) protegido por middleware
    sitemap.ts, robots.ts, llms.txt/route.ts
  components/
    layout/                 # Navbar (mega menú), Footer, WhatsAppFloat, ChromeGate
    ui/                     # Container, Button
    motion/                 # Reveal, Stagger, ParallaxBg
    ServiceDetail, ArticleCard, ArticleBody, Faqs, Byline, MedicalDisclaimer, JsonLd...
    admin/                  # ArticleEditor, NewUserForm
  content/                  # contenido TIPADO (fuente de verdad del catálogo)
    schema.ts               # Zod: Service, BlogPost, Block...
    services.ts             # 4 cirugías base · catalog.json (25 servicios)
    enrichment.json         # capa de citabilidad (whatItIs/recovery/keyFacts) por slug
    taxonomy.ts             # especialidades + prioridad por kind
    pexels.json, tech-images.json, service-images.json, videos.json  # manifiestos de imágenes
  lib/
    services.ts             # carga+valida el catálogo (aplica enrichment), helpers, serviceHref
    blog.ts                 # lee artículos de Supabase (cliente anónimo, RLS publicados)
    schema.ts               # builders JSON-LD (MedicalClinic, Physician, MedicalProcedure, FAQPage, Article...)
    menu.ts                 # datos del mega menú (con imagen por ítem)
    supabase/               # clients server/client/admin + middleware de sesión
    cta.ts
  config/
    site.ts                 # FUENTE ÚNICA de NAP, contacto, credenciales del Dr.
    images.ts               # serviceImage()/ambianceImage()/serviceVideo() + pools
```

## Convenciones de contenido (IMPORTANTE)

Ver `docs/CONTENT-GUIDELINES.md`. Reglas que **no** se deben romper:

1. **Léxico ad-safe (Google Ads):** nunca marcas/fármacos sensibles (p. ej. **"Botox"**) en el copy. Usar lenguaje de resultado ("suavizado de líneas de expresión"). Sin promesas absolutas ("garantizado", "sin riesgos", "cura").
2. **Prioridad de posicionamiento: CIRUGÍAS primero**, luego tratamientos, tecnologías. Se refleja en nav, footer, prioridad del sitemap.
3. **Credenciales del Dr. Orsini (YMYL):** publicar como hecho SOLO lo verificado con fuente primaria — **Miembro Titular #521 de la SVCPREM** y **Soc. Venezolana de Mastología**. Lo demás (ULA, Hospital Vargas, Sírio-Libanês, ASPS/ISAPS/FILACP, "4.000 casos") va con redacción atribuida ("según su biografía…") y NUNCA en el JSON-LD `Physician`. No publicar el dato refutado de la Clínica Leopoldo Aguerrevere.
4. **Estructura answer-first / GEO:** cada servicio abre con definición; pasajes de 130-170 palabras; FAQs (`FAQPage`); byline "Revisado por Dr. Orsini · SVCPREM #521"; disclaimer médico.

## Diseño

- **Paleta:** negro/carbón cálido `#17130f` (tokens `ink-*`, también `indigo-*`/`navy-*` por legado) + beige/nude `#c9b5a7` + crema `#faf7f3`. **No usar morado.**
- **Tipografía:** Gilda Display (serif, títulos) + Inter (cuerpo).
- Animaciones: `Reveal`/`Stagger` (entrada on-scroll), `ParallaxBg` (zoom-out cinematográfico), hover-lift, press-scale. Respetar `prefers-reduced-motion`.

## CMS / Admin (Supabase)

- Admin en `/admin` (login email+contraseña, protegido por `middleware.ts`). Pages bajo el grupo `app/admin/(panel)/`. `ChromeGate` oculta el chrome público en `/admin`.
- Tablas: `profiles` (rol admin/editor), `categories`, `articles` (body jsonb de bloques, status draft/published). RLS: publicados son públicos; autenticados gestionan todo.
- El blog público lee de Supabase con `revalidate = 60` (ISR). Publicar revalida (`revalidatePath`).
- **Variables de entorno** (en `.env.local`, NO commiteado): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Proyecto Supabase ref `imptqjcqfeqcvtqjsbdy`.

## Imágenes

- Logos en `public/img/brand/` (sitio publicado). Fotos reales del Dr./equipo en `public/img/drive/`. Imágenes específicas por servicio/tecnología (sitio publicado) en `public/img/service|tech/`. Pexels referenciales en `public/img/pexels/`. Videos de header en `public/videos/`. OG en `public/og.png`.
- `config/images.ts` decide la imagen por landing: específica del sitio publicado → Pexels temática → foto auténtica de fallback.

## Notas de deploy

- Conectar a Google Search Console al desplegar. Pendiente off-page (no es código): Google Business Profile, Doctoralia, prensa.
- `next.config.ts` permite el CDN de Webflow solo para migración; en producción los assets son locales.
