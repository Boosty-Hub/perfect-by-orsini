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
node scripts/db-query.mjs scripts/leads.sql   # crea la tabla `leads` (formularios) + RLS
PEXELS_API_KEY=... node scripts/blog-covers.mjs   # portadas Pexels por artículo → actualiza Supabase
node scripts/pull-instagram.mjs       # refresca los últimos 6 posts de IG en content/instagram.ts
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
    admin/                  # CMS: login + (panel): formularios (leads), artículos, categorías, páginas, usuarios
    sitemap.ts, robots.ts, llms.txt/route.ts
  components/
    layout/                 # Navbar (mega menú), Footer (redes+mapa), WhatsAppFloat (popup interactivo), ChromeGate
    ui/                     # Container, Button
    motion/                 # Reveal, Stagger, ParallaxBg (zoom-out cinematográfico), MouseParallax (sigue el cursor)
    ServiceDetail, ArticleCard, ArticleBody, Faqs, Byline, MedicalDisclaimer, JsonLd...
    Testimonials, SocialLinks, InstagramGrid + InstagramFeed, LeadForm
    admin/                  # ArticleEditor, NewUserForm
  content/                  # contenido TIPADO (fuente de verdad del catálogo)
    schema.ts               # Zod: Service, BlogPost, Block...
    services.ts             # 4 cirugías base · catalog.json (25 servicios)
    enrichment.json         # capa de citabilidad (whatItIs/recovery/keyFacts) por slug
    taxonomy.ts             # especialidades + prioridad por kind
    pexels.json, tech-images.json, service-images.json, videos.json  # manifiestos de imágenes
    testimonials.ts         # testimonios (PLACEHOLDER; `verified:true` activa el Review schema)
    instagram.ts            # feed de IG: widgetEmbedUrl (iframe) o posts[] (embed oficial) + fallback curado
  lib/
    services.ts             # carga+valida el catálogo (aplica enrichment), helpers, serviceHref
    blog.ts                 # lee artículos de Supabase (cliente anónimo, RLS publicados)
    schema.ts               # builders JSON-LD (MedicalClinic, Physician, MedicalProcedure, FAQPage, Article, reviewsSchema)
    menu.ts                 # datos del mega menú (con imagen por ítem)
    supabase/               # clients server/client/admin + middleware de sesión
    lead-actions.ts         # server action submitLead → inserta en tabla `leads` (service-role)
    cta.ts
  config/
    site.ts                 # FUENTE ÚNICA de NAP, contacto, credenciales del Dr., redes (IG/FB/X)
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
- Animaciones: `Reveal`/`Stagger` (entrada on-scroll), `ParallaxBg` (zoom-out cinematográfico al entrar en vista), `MouseParallax` (imágenes que siguen el cursor en hero/mosaicos), hover-lift, press-scale, popup animado del botón de WhatsApp. Respetar `prefers-reduced-motion`.

## CMS / Admin (Supabase)

- Admin en `/admin` (login email+contraseña, protegido por `middleware.ts`). Pages bajo el grupo `app/admin/(panel)/`. `ChromeGate` oculta el chrome público en `/admin`.
- Tablas: `profiles` (rol admin/editor), `categories`, `articles` (body jsonb de bloques, status draft/published), `leads` (formularios). RLS: artículos publicados son públicos; autenticados gestionan todo; **los `leads` solo los leen admins autenticados** (insert vía service-role en el server action).
- El blog público lee de Supabase con `revalidate = 60` (ISR). Publicar revalida (`revalidatePath`).
- **Variables de entorno** (en `.env.local`, NO commiteado): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Proyecto Supabase ref `imptqjcqfeqcvtqjsbdy`.

## Formularios / Leads

- `LeadForm` (client) en el **home y en TODAS las landings**; el contenido se personaliza por servicio/`kind` (título, intro, placeholder, interés pre-cargado). El home usa un select con todos los servicios.
- Envío → server action `submitLead` (`lib/lead-actions.ts`) inserta en `leads` con `form_source` (de qué formulario viene, p. ej. "Cirugía: Rinoplastia", "Home"), `service_slug`, datos y `page_path`.
- Se gestionan en **`/admin/formularios`** (filtro por formulario; contacto clicable a WhatsApp/email). Tabla creada con `scripts/leads.sql`.

## Testimonios, redes e Instagram

- **Testimonios** (`content/testimonials.ts`): son **PLACEHOLDER ad-safe** — NO hay reseñas de Google verificables. Reemplazar por reales y marcar `verified:true` para emitir `Review`/`AggregateRating` (`reviewsSchema`). Se muestran en home y en cada landing.
- **Redes** (`SocialLinks`): Instagram/Facebook/X (@doctororsini) en footer + sección de Instagram. URLs en `config/site.ts`.
- **Instagram** (`content/instagram.ts` + `InstagramFeed`): últimos 6 posts reales vía **embed.js oficial** (lista de permalinks) o un **widget** (`widgetEmbedUrl`); si ambos vacíos, grilla curada de fallback. `scripts/pull-instagram.mjs` recaptura los permalinks y el workflow `.github/workflows/instagram-refresh.yml` lo corre **cada 4 días** (commitea solo si hay posts nuevos).
- **WhatsApp** (`WhatsAppFloat`): botón flotante con pulso + popup interactivo; el mensaje incluye la **URL de la página de origen**.

## Imágenes

- Logos en `public/img/brand/` (sitio publicado). Fotos reales del Dr./equipo en `public/img/drive/`. Imágenes específicas por servicio/tecnología (sitio publicado) en `public/img/service|tech/`. Pexels referenciales en `public/img/pexels/`. Videos de header en `public/videos/`. OG en `public/og.png`.
- `config/images.ts` decide la imagen por landing: específica del sitio publicado → Pexels temática → foto auténtica de fallback.

## Notas de deploy

- **Variables de entorno en el host (Netlify/Vercel):** configurar las 3 de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). El `.env.local` NO se commitea, así que **sin esto el build FALLA** al pre-renderizar `/blog/[slug]` (`Error: supabaseUrl is required`). Las `NEXT_PUBLIC_*` deben estar disponibles en build.
- **API de publicación del blog** (hub externo de SEO → este sitio): `POST /api/blog/publish` (upsert por slug, HTML sanitizado con `sanitize-html`, imágenes por URL). Requiere `BLOG_PUBLISH_SECRET` en el host (sin ella el endpoint responde 503); opcionales `BLOG_DEFAULT_TOPIC|AUTHOR|STATUS`. Contrato completo en `docs/BLOG-API.md`.
- Repo en GitHub: **`Boosty-Hub/perfect-by-orsini`** (privado). GitHub Actions: workflow de Instagram cada 4 días.
- Conectar a Google Search Console al desplegar. Pendiente off-page (no es código): Google Business Profile, Doctoralia, prensa.
- `next.config.ts` permite el CDN de Webflow solo para migración; en producción los assets son locales.
