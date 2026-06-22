# API de publicación del blog (`/api/blog/publish`)

Endpoint **servidor→servidor** para que un proyecto externo (el "hub" de SEO) publique
artículos en este sitio de forma automática. Compatible con el conector **Custom (API
propia)** del hub.

## Conexión

| Campo del hub | Valor |
|---|---|
| **Endpoint (URL de publicación)** | `https://perfectbyorsini.com/api/blog/publish` |
| **Secreto** | el valor de `BLOG_PUBLISH_SECRET` (ver más abajo) |
| **Cabecera de auth** | `Authorization: Bearer` (también se acepta `x-api-key`) |
| **Autor por defecto** | opcional (p. ej. `Dr. Omar Orsini`) |
| **Categoría por defecto** | opcional (`belleza`, `novedades` o `prevencion`) |
| **Estado al publicar** | `Publicado` o `Borrador` |

### Variables de entorno (Netlify + `.env.local`)

```
BLOG_PUBLISH_SECRET=<secreto largo y aleatorio>   # OBLIGATORIO
BLOG_DEFAULT_TOPIC=novedades                       # opcional (belleza|novedades|prevencion)
BLOG_DEFAULT_AUTHOR=Dr. Omar Orsini                # opcional
BLOG_DEFAULT_STATUS=published                      # opcional (published|draft)
```

> El secreto lo define **este** sitio y se pega en el campo "Secreto" del hub.
> Si falta `BLOG_PUBLISH_SECRET`, el endpoint responde `503`.

## Autenticación

```
Authorization: Bearer <BLOG_PUBLISH_SECRET>
# o bien
x-api-key: <BLOG_PUBLISH_SECRET>
```

## Probar conexión (no publica nada)

El hub hace **`POST` con cuerpo vacío `{}`** al "Probar conexión". Respuestas:

```
POST /api/blog/publish  {}   con secreto INVÁLIDO  → 401
POST /api/blog/publish  {}   con secreto VÁLIDO    → 400 { "error": "Falta 'title'." }
GET  /api/blog/publish       con secreto VÁLIDO    → 200 (comprobación manual)
```

> Importante (contrato del hub): con secreto válido y `{}` la respuesta correcta es
> **400** (error de validación), **no** 200 ni 500. El hub interpreta ese 400 como
> "conexión OK, falta el artículo".

## Publicar / actualizar (upsert por `slug`)

`POST /api/blog/publish` con cuerpo JSON. **El contenido se envía como HTML** y las
**imágenes son URLs públicas** (el endpoint no sube binarios). Reenviar el mismo `slug`
**actualiza** el artículo.

### Campos

El parser es tolerante: acepta varios alias por campo. La columna **"Hub"** es el nombre
exacto que envía el Content & SEO Hub.

| Campo (Hub) | Req. | Descripción · otros alias aceptados |
|---|---|---|
| `title` | ✅ | Título (es el H1). Alias: `titulo`, `name`, `heading` |
| `content_html` | ✅ | Cuerpo en **HTML** limpio. Alias: `content`, `html`, `bodyHtml`, `body` |
| `status` | ✅ | `published` / `draft`. Alias booleanos: `publish`, `published`. Default: env |
| `upsert` | — | El endpoint **siempre** hace upsert por `slug` (reenviar no duplica), envíe o no este flag |
| `slug` | — | Si falta, se deriva del título. Alias: `permalink` |
| `seo_title` | — | Meta title. Alias: `seoTitle`, `meta_title`, `metaTitle` |
| `seo_description` | — | Meta description / resumen. Alias: `excerpt`, `summary`, `description`. Si falta se deriva del contenido |
| `author_name` | — | Autor. Alias: `author`, `byline`, `autor`. Default: `Dr. Omar Orsini` |
| `category` | — | Alias: `topic`, `categoria`. Se mapea a `belleza`/`novedades`/`prevencion` (default si no coincide) |
| `cover_image` | — | URL **pública https** de la portada (http se rechaza). Alias: `cover`, `image`, `featured_image`, `imageUrl`, `thumbnail` |
| `published_at` | — | Fecha ISO. Si es **futura**, se programa (best-effort): el artículo queda oculto hasta esa fecha y aparece solo vía ISR. Se conserva en re-publicaciones |
| `tags` | — | Array de etiquetas (o string separado por comas). Se almacenan, se muestran como chips en el artículo y se emiten como `keywords` en el JSON-LD `Article`. Máx. 20, ≤50 chars c/u |
| `faqs` | — | `[{ question, answer }]` (alias `q`/`a`, `pregunta`/`respuesta`) — extensión propia, el hub no lo envía |

> El HTML se **sanitiza con un parser de lista blanca** (`sanitize-html`): se eliminan
> `script`/`style`/`iframe`/`svg`, manejadores `on*`, URLs `javascript:` (incluidas las
> sin comillas y codificadas con entidades) y atributos `style`. Se conservan títulos
> (h2–h4), listas, enlaces (con `rel="noopener noreferrer nofollow"`), negritas, citas,
> tablas e imágenes (solo `https`, con `referrerpolicy="no-referrer"`). `reading_time`
> se calcula solo. Límite del HTML: **200 KB** (cuerpo total: 1 MB).

### Ejemplo

```bash
curl -X POST https://perfectbyorsini.com/api/blog/publish \
  -H "Authorization: Bearer $BLOG_PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cómo cuidar la piel tras un peeling",
    "slug": "cuidados-tras-peeling",
    "status": "published",
    "upsert": true,
    "category": "prevencion",
    "seo_title": "Cuidados tras un peeling | Perfect by Dr. Orsini",
    "seo_description": "Guía rápida de cuidados posteriores a un peeling facial.",
    "cover_image": "https://images.example.com/peeling.jpg",
    "content_html": "<h2>Primeras 48 horas</h2><p>Hidrata e evita el sol…</p><ul><li>Protector solar</li></ul>"
  }'
```

### Respuestas

```jsonc
// éxito (HTTP 2xx) — incluye al menos id y url (lo que lee el hub)
{ "ok": true, "action": "created", "id": "…", "slug": "…", "status": "published",
  "url": "https://perfectbyorsini.com/blog/cuidados-tras-peeling" }

// errores (el hub muestra el campo "error")
401 { "ok": false, "error": "No autorizado." }                 // secreto ausente/ inválido
400 { "ok": false, "error": "Falta 'title'." }                 // validación (incluye health-check {})
413 { "ok": false, "error": "El contenido supera el tamaño máximo permitido." }
503 { "ok": false, "error": "Publicación no disponible." }     // falta BLOG_PUBLISH_SECRET
```

## Notas

- Tras publicar se revalidan `/blog`, `/blog/{slug}` y `/blog/categoria/{topic}`. El
  sitemap se regenera por su propia ventana ISR (cada hora), así que un artículo nuevo
  aparece en `sitemap.xml` en ≤ 1 h sin necesidad de re-deploy.
- El sitio renderiza 3 categorías: `belleza`, `novedades`, `prevencion`. Las categorías
  desconocidas se mapean a la categoría por defecto (no se crean páginas nuevas).
- **Imágenes:** las portadas remotas se renderizan sin pasar por el optimizador de
  Next (`/_next/image`) para no exponer un proxy de imágenes abierto; por eso no hace
  falta listar el host del hub en `next.config.ts`. Las imágenes dentro del cuerpo deben
  ser `https`.
- **Seguridad:** endpoint protegido por secreto de alta entropía (32 bytes). Considera
  añadir rate-limiting a nivel de Netlify/edge como defensa en profundidad. El secreto
  puede rotarse cambiando `BLOG_PUBLISH_SECRET` en Netlify y en el hub.
- Prueba local: `node scripts/test-blog-publish.mjs` (lee `.env.local`).
