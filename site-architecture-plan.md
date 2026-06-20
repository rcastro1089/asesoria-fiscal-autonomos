# 🏗️ Plan de Arquitectura — Sitio AdSense "Asesoría Fiscal Autónomos España"

**Proyecto:** asesoria-fiscal-es
**Nicho:** Fiscalidad práctica para autónomos digitales (España)
**Stack:** Astro 6 (SSG) + Tailwind CSS 4 + Cloudflare Pages + Google AdSense
**Fecha:** 2026-06-20
**Estado:** Plan de implementación — listo para construir

---

## 0. Resumen Ejecutivo

Sitio estático orientado a SEO/AdSense en el nicho de fiscalidad de autónomos.
La estrategia se apoya en **4 gaps reales** (donde ningún competidor rankea: IVA deducible,
retenciones IRPF, factura electrónica, calendario fiscal) más contenido evergreen + estacional.

**Prioridades de arquitectura:**
1. **Velocidad** — Astro SSG genera HTML puro, sin JS por defecto (Lighthouse 95+). Crítico para Core Web Vitals y RPM de AdSense.
2. **Escalabilidad de contenido** — Content Collections con frontmatter tipado para escalar de 10 → 100+ artículos sin tocar código.
3. **SEO técnico desde el día 1** — Schema, sitemap, breadcrumbs, internal linking automatizado.
4. **Islas interactivas** — Calculadoras y calendario como componentes hidratados (Astro Islands) sin penalizar el resto del sitio.

---

## 1. Estructura de Directorios

```
asesoria-fiscal-es/
├── astro.config.mjs
├── tailwind.config.ts          # (opcional en TW4 — config vía CSS)
├── tsconfig.json
├── package.json
├── wrangler.toml               # config Cloudflare Pages (headers, redirects)
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── ads.txt                 # ⚠️ OBLIGATORIO para AdSense
│   ├── _headers                # cache-control Cloudflare
│   ├── _redirects              # redirecciones 301
│   └── og/                     # imágenes Open Graph por categoría
├── src/
│   ├── content/
│   │   ├── config.ts           # esquemas Zod de las colecciones
│   │   ├── articulos/          # .md/.mdx — un archivo por artículo
│   │   │   ├── iva-deducible-autonomos.md
│   │   │   ├── retenciones-irpf-autonomos.md
│   │   │   └── ...
│   │   ├── categorias/         # metadatos de cada categoría
│   │   │   ├── modelos-fiscales.md
│   │   │   ├── cuota-autonomos.md
│   │   │   └── ...
│   │   └── autores/            # E-E-A-T: fichas de autor
│   │       └── equipo-fiscal.md
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Nav.astro
│   │   │   └── Breadcrumbs.astro
│   │   ├── content/
│   │   │   ├── ArticleCard.astro
│   │   │   ├── ArticleMeta.astro       # autor, fecha, tiempo lectura
│   │   │   ├── CategoryGrid.astro
│   │   │   ├── TableOfContents.astro
│   │   │   ├── RelatedArticles.astro   # internal linking automático
│   │   │   ├── FAQ.astro               # genera FAQPage schema
│   │   │   └── Callout.astro           # avisos/tips destacados
│   │   ├── ads/
│   │   │   ├── AdSense.astro           # wrapper base de unidad
│   │   │   ├── AdInArticle.astro       # anuncio in-feed/in-article
│   │   │   └── AdSidebar.astro
│   │   ├── seo/
│   │   │   ├── BaseHead.astro          # meta tags + OG + Twitter
│   │   │   ├── SchemaArticle.astro
│   │   │   ├── SchemaFAQ.astro
│   │   │   ├── SchemaHowTo.astro
│   │   │   └── SchemaBreadcrumb.astro
│   │   └── interactive/                # Islas (Preact/JS vanilla)
│   │       ├── CalculadoraIRPF.tsx
│   │       ├── CalculadoraIVA.tsx
│   │       ├── CalculadoraCuota.tsx
│   │       ├── CalendarioFiscal.tsx
│   │       └── ComparadorSoftware.tsx
│   ├── layouts/
│   │   ├── BaseLayout.astro            # html, head, header, footer
│   │   ├── ArticleLayout.astro         # layout de artículo + ads + TOC
│   │   ├── CategoryLayout.astro
│   │   └── ToolLayout.astro            # layout para calculadoras
│   ├── pages/
│   │   ├── index.astro                 # Home
│   │   ├── 404.astro
│   │   ├── sobre-nosotros.astro
│   │   ├── contacto.astro
│   │   ├── aviso-legal.astro
│   │   ├── politica-privacidad.astro   # ⚠️ OBLIGATORIO AdSense/RGPD
│   │   ├── politica-cookies.astro      # ⚠️ OBLIGATORIO
│   │   ├── articulos/
│   │   │   └── [slug].astro            # página dinámica de artículo
│   │   ├── categoria/
│   │   │   └── [categoria].astro       # listado por categoría (paginado)
│   │   ├── calculadoras/
│   │   │   ├── index.astro
│   │   │   ├── irpf.astro
│   │   │   ├── iva.astro
│   │   │   └── cuota-autonomos.astro
│   │   └── calendario-fiscal.astro
│   ├── styles/
│   │   └── global.css                  # @import "tailwindcss" + tokens
│   ├── lib/
│   │   ├── seo.ts                      # helpers de meta/canonical
│   │   ├── schema.ts                   # generadores de JSON-LD
│   │   ├── reading-time.ts
│   │   └── related.ts                  # lógica de artículos relacionados
│   └── data/
│       ├── site.ts                     # config global (nombre, url, social)
│       ├── nav.ts                      # estructura de navegación
│       └── calendario-2026.json        # fechas fiscales (fuente del calendario)
```

**Decisiones clave:**
- **`src/content/` con Content Collections** en lugar de carpetas sueltas → validación de frontmatter con Zod, autocompletado, y `getCollection()` para queries.
- **Categorías como colección** (no hardcodeadas) → añadir categoría = añadir un `.md`.
- **`src/data/calendario-2026.json`** como única fuente de verdad del calendario, reutilizable por la isla interactiva y por el artículo.

---

## 2. Componentes Principales

### Layout
| Componente | Responsabilidad |
|-----------|-----------------|
| `BaseLayout.astro` | `<html lang="es">`, `BaseHead`, skip-link a11y, Header, `<slot/>`, Footer. Carga script de AdSense (async) y banner de consentimiento de cookies. |
| `Header.astro` | Logo + `Nav` + buscador (opcional, Pagefind). Sticky en desktop. |
| `Nav.astro` | Menú con las 8 categorías + "Calculadoras" + "Calendario". Mobile: drawer accesible. |
| `Footer.astro` | Enlaces legales (privacidad, cookies, aviso legal), categorías, disclaimer fiscal. |
| `Breadcrumbs.astro` | Visual + emite `SchemaBreadcrumb`. Inicio › Categoría › Artículo. |

### Contenido
| Componente | Responsabilidad |
|-----------|-----------------|
| `ArticleCard.astro` | Tarjeta (título, extracto, categoría, fecha, tiempo lectura, imagen). Usada en home, categorías y relacionados. |
| `ArticleMeta.astro` | Autor (link a ficha), fecha publicación + actualización, tiempo de lectura → señal E-E-A-T. |
| `TableOfContents.astro` | Genera índice desde `headings` de Astro. Sticky en desktop, mejora dwell time. |
| `RelatedArticles.astro` | 3-4 artículos de la misma categoría/tags → internal linking automático. |
| `FAQ.astro` | Acordeón accesible + emite `FAQPage` schema (rich snippets). |
| `Callout.astro` | Bloques destacados (`tip`, `aviso`, `plazo`) para escaneabilidad. |

### Anuncios
| Componente | Responsabilidad |
|-----------|-----------------|
| `AdSense.astro` | Componente base con `data-ad-client`/`data-ad-slot`. Lazy + reserva de espacio (evita CLS). |
| `AdInArticle.astro` | Anuncio fluido insertado entre párrafos del contenido. |
| `AdSidebar.astro` | Display vertical en sidebar (solo desktop). |

### SEO
| Componente | Responsabilidad |
|-----------|-----------------|
| `BaseHead.astro` | title, description, canonical, OG, Twitter Card, robots, theme-color, hreflang `es-ES`. |
| `SchemaArticle/FAQ/HowTo/Breadcrumb.astro` | Inyectan JSON-LD `<script type="application/ld+json">`. |

### Interactivas (Astro Islands — hidratación selectiva)
- Se cargan con `client:visible` (solo al hacer scroll hasta ellas) → cero coste en First Load.
- Recomendación: **JS vanilla o Preact** (mínimo bundle) en lugar de React completo para mantener Lighthouse alto.

---

## 3. Páginas Esenciales

| Ruta | Tipo | Propósito |
|------|------|-----------|
| `/` | Home | Hero + categorías destacadas + últimos artículos + CTA calculadoras. |
| `/articulos/[slug]` | Artículo | Página dinámica generada por `getStaticPaths()` desde la colección. |
| `/categoria/[categoria]` | Listado | Paginado (`paginate()`), grid de `ArticleCard`, intro SEO de categoría. |
| `/calculadoras/` + 3 hijas | Herramienta | Calculadoras IRPF / IVA / Cuota. Alto valor de enlace + tiempo en página. |
| `/calendario-fiscal` | Herramienta | Calendario interactivo 2026 con próximos plazos resaltados. |
| `/sobre-nosotros` | Estática | E-E-A-T: quién está detrás, metodología. |
| `/contacto` | Estática | Formulario (Cloudflare/Web3Forms) — señal de confianza. |
| `/aviso-legal`, `/politica-privacidad`, `/politica-cookies` | Legal | **Obligatorias** para aprobación de AdSense y RGPD. |
| `/404` | Error | Sugerencias de artículos populares. |

**Páginas legales = requisito bloqueante.** AdSense rechaza sitios sin política de privacidad que mencione el uso de cookies de terceros (Google) ni sitios sin contenido sustancial.

---

## 4. Sistema de Contenido (Content Collections)

### `src/content/config.ts`
```ts
import { defineCollection, reference, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().max(60),            // título SEO
    description: z.string().max(160),     // meta description
    slug: z.string().optional(),
    categoria: reference('categorias'),
    autor: reference('autores'),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: image().optional(),
    keywords: z.array(z.string()),        // KW objetivo + secundarias
    cpc: z.number().optional(),           // metadato interno (priorización)
    volumen: z.number().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    howto: z.array(z.object({ paso: z.string(), detalle: z.string() })).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const categorias = defineCollection({
  type: 'content',
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    orden: z.number(),
    icono: z.string().optional(),
  }),
});

const autores = defineCollection({
  type: 'content',
  schema: z.object({ nombre: z.string(), bio: z.string(), credenciales: z.string() }),
});

export const collections = { articulos, categorias, autores };
```

### Flujo de creación de un artículo
1. Crear `src/content/articulos/mi-articulo.md`.
2. Rellenar frontmatter (title, description, categoria, keywords, faq, howto).
3. Escribir el cuerpo en Markdown. Usar `<Callout>` y componentes vía MDX si hace falta.
4. `pubDate` controla orden; `draft: true` lo excluye del build de producción.
5. El schema FAQ/HowTo se genera automáticamente desde el frontmatter `faq`/`howto`.

**Convención de naming:** slug = keyword principal en kebab-case → URL = `/articulos/iva-deducible-autonomos`.

---

## 5. Configuración de Astro

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';   // islas ligeras

export default defineConfig({
  site: 'https://asesoria-fiscal-autonomos.es',  // dominio definitivo
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [
    mdx(),
    preact({ compat: false }),
    sitemap({
      changefreq: 'weekly',
      filter: (page) => !page.includes('/borrador'),
    }),
  ],
  vite: { plugins: [tailwind()] },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
```

### Tailwind 4
- En TW4 la config vive en CSS. `src/styles/global.css`:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@theme {
  --color-brand: #0d5c4d;       /* verde fiscal/confianza */
  --color-accent: #f4a300;
  --font-sans: "Inter", system-ui, sans-serif;
}
```
- `prose` (typography) para el cuerpo de artículos.

### `package.json` (dependencias clave)
```
astro, @astrojs/sitemap, @astrojs/mdx, @astrojs/preact, preact,
@tailwindcss/vite, tailwindcss, @tailwindcss/typography,
pagefind (búsqueda estática opcional)
```

### Cloudflare Pages — `public/_headers`
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```
Build command: `astro build` · Output dir: `dist` · Node 20.

---

## 6. Estrategia de SEO

### On-page (por artículo)
- **Title** ≤ 60 chars con KW principal al inicio.
- **Meta description** ≤ 160 chars con CTA.
- **Canonical** absoluta auto-generada.
- **H1 único** = título; jerarquía H2/H3 limpia (alimenta TOC y featured snippets).
- **Internal linking:** `RelatedArticles` + enlaces contextuales manuales en el cuerpo hacia artículos pilar.
- **Imágenes:** `astro:assets` (WebP/AVIF, lazy, width/height para evitar CLS), `alt` descriptivo.

### Schema Markup (JSON-LD)
| Tipo | Dónde |
|------|-------|
| `Article` / `BlogPosting` | Todos los artículos (autor, fechas, publisher). |
| `FAQPage` | Artículos con bloque `faq` → rich snippets. |
| `HowTo` | Tutoriales (alta autónomo, modelo 130 paso a paso). |
| `BreadcrumbList` | Todas las páginas internas. |
| `WebSite` + `SearchAction` | Home. |
| `Organization` | Footer/Home (E-E-A-T). |

### Técnico
- **Sitemap XML** automático (`@astrojs/sitemap`).
- **`robots.txt`** permitiendo todo + ubicación del sitemap; bloquear params de calculadoras.
- **hreflang `es-ES`**.
- **Core Web Vitals:** objetivo LCP < 2.0s, CLS < 0.05, INP < 200ms → reservar espacio de anuncios.
- **Estructura de URLs plana:** `/articulos/[slug]` y `/categoria/[cat]` (sin fechas, evita decay).

### Arquitectura de enlazado (topic clusters)
Cada **categoría = pillar page**; los artículos son cluster pages que enlazan al pilar y entre sí.
Ej.: pilar "Cuota de autónomos" ← enlazan "tarifa plana", "tramos cuota", "bonificaciones".

---

## 7. Integración de AdSense

### Requisitos previos a la aprobación
1. ✅ 15-20 artículos de calidad (1.500+ palabras los pilares) publicados ANTES de solicitar.
2. ✅ Páginas legales (privacidad mencionando Google AdSense + cookies, aviso legal, contacto).
3. ✅ `ads.txt` en `public/` con la línea de tu publisher.
4. ✅ Banner de consentimiento de cookies (CMP) compatible con RGPD — obligatorio en UE.
5. ✅ Navegación clara y dominio propio con cierta antigüedad.

### Ubicación de anuncios (sin penalizar UX ni CWV)
| Posición | Componente | Notas |
|----------|-----------|-------|
| Después del 1er párrafo / tras intro | `AdInArticle` | Mayor viewability. |
| Mitad del artículo (cada ~4-5 H2) | `AdInArticle` | Máx 3 in-article en posts largos. |
| Final del artículo (antes de relacionados) | `AdSense` display | |
| Sidebar (solo desktop ≥1024px) | `AdSidebar` | Sticky, 300×600. |
| **NO** en home above-the-fold ni en calculadoras (afecta interacción/INP). |

### Implementación técnica
- Cargar `adsbygoogle.js` **async** una sola vez en `BaseLayout` tras consentimiento.
- **Reservar dimensiones** con `min-height` en cada slot → CLS ≈ 0.
- Slots **manuales** recomendados (controlas densidad) frente a Auto Ads.
- Anuncios **solo tras consentimiento** (cargar condicionalmente según CMP).

### Monetización complementaria
- **Afiliación**: gestorías online (TaxDown, Declarando), software de facturación electrónica (alto CPC $2.61 → buen fit afiliado). Insertar en `ComparadorSoftware`.

---

## 8. Plan de Contenido Inicial (Primeros 10 Artículos)

Orden por **ROI** (gap real + esfuerzo + CPC), según investigación en `research/02-investigacion-final.md`.

### Fase 1 — Quick Wins (gaps 100%, nadie rankea)
| # | Artículo | KW | Vol | CPC | Tipo | Componentes |
|---|----------|-----|-----|-----|------|-------------|
| 1 | IVA deducible para autónomos: guía completa 2026 | iva deducible autonomos | 390 | $0.32 | Guía | FAQ, tabla, CalculadoraIVA |
| 2 | Retenciones IRPF para autónomos: todo lo que debes saber | retenciones irpf autonomos | 720 | $1.00 | Guía + calc | CalculadoraIRPF, FAQ |
| 3 | Factura electrónica para autónomos: cómo cumplir la normativa | factura electronica autonomos | 590 | $2.61 | Comparativa | ComparadorSoftware, FAQ, afiliado |
| 4 | Calendario fiscal autónomos 2026: fechas clave | calendario fiscal autonomos 2026 | 720 | $1.37 | Herramienta | CalendarioFiscal, HowTo |

### Fase 2 — Gaps parciales (superar al competidor)
| # | Artículo | KW | Vol | CPC | Tipo |
|---|----------|-----|-----|-----|------|
| 5 | Tarifa plana autónomos 2026: requisitos, cuantía y cómo solicitarla | tarifa plana autonomos 2026 | 2.400 | $1.16 | Guía + HowTo |
| 6 | Darse de alta como autónomo: guía paso a paso 2026 | darse de alta autonomo | 1.600 | $1.56 | HowTo + checklist |
| 7 | Cuota de autónomos 2026: tramos, cálculo y bonificaciones | cuota autonomos 2026 | 8.100 | $1.75 | Pilar + CalculadoraCuota |

### Fase 3 — Premium (alto CPC / volumen, más esfuerzo)
| # | Artículo | KW | Vol | CPC | Tipo |
|---|----------|-----|-----|-----|------|
| 8 | Modelo 130 para autónomos: guía completa + ejemplos | modelo 130 autonomos | 2.400 | $2.30 | Tutorial + HowTo |
| 9 | Declaración de la renta autónomos 2026 | declaracion renta autonomos 2026 | 60.500 | $2.74 | Pilar estacional |
| 10 | Gastos deducibles para autónomos 2026: lista completa | gastos deducibles autonomos | 390 | $0.32 | Pilar (base de enlazado) |

**Mapa de pilares ↔ categorías:**
- Pilar "Cuota de autónomos" (#7) ← #5 tarifa plana
- Pilar "Gastos deducibles" (#10) ← #1 IVA deducible
- Pilar "IRPF y retenciones" ← #2 retenciones, #9 renta
- Pilar "Modelos fiscales" ← #8 modelo 130
- Pilar "Facturación electrónica" ← #3 factura electrónica
- Pilar "Calendario fiscal" ← #4 calendario
- Pilar "Altas y bajas" ← #6 alta autónomo

---

## 9. Roadmap de Implementación

| Fase | Tareas | Entregable |
|------|--------|-----------|
| **0. Scaffold** | `npm create astro`, Tailwind 4, integraciones, layouts base, config colecciones | Sitio "hola mundo" desplegado en CF Pages |
| **1. Plantillas** | BaseLayout, ArticleLayout, Header/Footer/Breadcrumbs, BaseHead + schemas | 1 artículo demo renderizado con SEO completo |
| **2. Contenido base** | Páginas legales, sobre-nosotros, contacto, home, listados de categoría | Estructura navegable |
| **3. Artículos 1-7** | Redactar + maquetar Fases 1-2 (gaps) | 7 artículos publicados |
| **4. Interactivas** | CalculadoraIRPF, IVA, Cuota, CalendarioFiscal, ComparadorSoftware | Islas funcionando con `client:visible` |
| **5. AdSense** | ads.txt, CMP cookies, componentes Ad, solicitar aprobación | Anuncios activos tras aprobación |
| **6. Escalado** | Artículos 8-10 + 10 más, optimización CWV, búsqueda Pagefind | 20+ artículos, sitio maduro |

---

## 10. Checklist de Requisitos Bloqueantes (no olvidar)

- [ ] `public/ads.txt` con línea del publisher
- [ ] `public/robots.txt` + sitemap referenciado
- [ ] Política de privacidad (menciona Google AdSense + cookies de terceros)
- [ ] Política de cookies + banner de consentimiento (RGPD/CMP)
- [ ] Aviso legal + página de contacto
- [ ] Fichas de autor con credenciales (E-E-A-T)
- [ ] Disclaimer fiscal en footer ("contenido informativo, no asesoramiento profesional")
- [ ] Schema JSON-LD validado (Rich Results Test)
- [ ] Reserva de espacio en slots de anuncios (CLS < 0.05)
- [ ] `site` correcto en `astro.config.mjs` (canonical/sitemap dependen de él)

---

*Plan generado el 20 de junio de 2026. Basado en `research/02-investigacion-final.md` y `verified_opportunities.json`.*
