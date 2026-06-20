# Design: Sitio AdSense Asesoría Fiscal Autónomos España

## Context

El proyecto construye un sitio AdSense en el nicho "fiscalidad práctica para autónomos digitales" en España. La investigación de keywords (1.529 keywords analizadas, $0.517 gastados) identificó **4 gaps reales** donde ningún competidor (taxdown.es, infoautonomos.com, asesorexcelente.com) rankea: **IVA deducible, retenciones IRPF, factura electrónica y calendario fiscal**. El CPC promedio del nicho es $1-3 con competencia baja, y el RPM esperado en finanzas para España es $3-6.

El factor crítico de éxito es la **velocidad** (Core Web Vitals afectan tanto al ranking como al RPM de AdSense) y la **escalabilidad de contenido** (pasar de 10 → 100+ páginas sin tocar código). Esto determina el stack: Astro 6 SSG (HTML puro, cero JS por defecto) + Tailwind 4 + Cloudflare Pages (CDN global gratuito), con islas interactivas hidratadas selectivamente para las calculadoras y el calendario.

Las páginas legales y el cumplimiento RGPD son **requisitos bloqueantes**: AdSense rechaza sitios sin política de privacidad que mencione cookies de terceros de Google ni sitios sin contenido sustancial.

## Goals / Non-Goals

### Goals
- Sitio estático ultrarrápido (Lighthouse ≥ 95, LCP < 2.0s, CLS < 0.05, INP < 200ms).
- Escalar contenido vía Content Collections tipadas (frontmatter Zod) sin tocar código.
- Cubrir los 4 gaps reales primero (máximo ROI, mínima competencia).
- SEO técnico desde el día 1: schema, sitemap, breadcrumbs, internal linking por clusters.
- Aprobación de AdSense: páginas legales, CMP RGPD, ads.txt, contenido sustancial.
- Calculadoras y calendario interactivos como islas sin penalizar CWV.
- Glosario 100+ términos como programmatic SEO con calendario de publicación escalonado.

### Non-Goals
- No hay backend ni base de datos (todo estático/SSG).
- No se compite por keywords navegacionales del gobierno (tu/mi seguridad social, TGSS, etc.).
- No se usa React completo (Preact para minimizar bundle).
- No se usa Auto Ads (slots manuales para controlar densidad y CWV).
- No se ofrece asesoramiento fiscal personalizado (solo contenido informativo).
- No se implementa i18n multi-idioma (solo es-ES).

## Architecture Decisions

### Decisión 1: Astro 6 en modo SSG
**Elección:** Generación estática (HTML pre-renderizado), no SSR.
**Rationale:** El contenido es evergreen/estacional y no requiere personalización por request. SSG da HTML puro servible desde CDN, máxima velocidad y coste cero de servidor. Crítico para CWV y RPM de AdSense.
**Alternativas:** SSR (innecesario, añade latencia y coste), WordPress (lento, pesado, mala CWV).

### Decisión 2: Content Collections con esquemas Zod
**Elección:** Todo el contenido (artículos, categorías, autores) en `src/content/` con validación Zod en `config.ts`.
**Rationale:** Frontmatter tipado = errores en build, no en producción; autocompletado; `getCollection()` para queries. Permite escalar a 100+ artículos manteniendo consistencia.
**Trade-off:** Curva de aprendizaje de Zod, pero el coste se amortiza con la escala.

### Decisión 3: Categorías como colección (no hardcodeadas)
**Elección:** Cada categoría es un `.md` en `src/content/categorias/`.
**Rationale:** Añadir una categoría = añadir un archivo, sin tocar código. Las categorías son pillar pages en la arquitectura de topic clusters.

### Decisión 4: Preact para las islas interactivas
**Elección:** Calculadoras y calendario en Preact (`.tsx`), no React.
**Rationale:** Preact pesa ~3KB vs ~45KB de React. Mismo modelo mental (JSX/hooks) con bundle mínimo, preservando Lighthouse alto. Hidratación con `client:visible` → cero coste hasta el scroll.
**Alternativas:** JS vanilla (más verboso para estado), React (bundle excesivo).

### Decisión 5: Tailwind CSS 4 vía CSS-first config
**Elección:** Tailwind 4 con `@tailwindcss/vite` y tema en `global.css` (`@theme`), sin `tailwind.config.ts`.
**Rationale:** TW4 mueve la configuración a CSS; menos archivos JS de config, build más rápido. `@tailwindcss/typography` (`prose`) para el cuerpo de artículos.

### Decisión 6: Cloudflare Pages como hosting
**Elección:** Build `astro build` → `dist`, servido por CF Pages (Node 20).
**Rationale:** CDN global gratuito, despliegue por git, `_headers`/`_redirects` para cache-control y 301. Sin coste de infraestructura.
**Trade-off:** Acoplamiento a convenciones de CF (`_headers`), pero son portables.

### Decisión 7: Una sola fuente de verdad para el calendario fiscal
**Elección:** `src/data/calendario-2026.json` consumido por la isla interactiva y por el artículo.
**Rationale:** Evita duplicar las fechas fiscales. Renovar el calendario anualmente = editar un JSON. DRY entre herramienta y contenido.

### Decisión 8: AdSense con slots manuales condicionados a consentimiento
**Elección:** Slots manuales (no Auto Ads), carga de `adsbygoogle.js` async solo tras consentimiento del CMP, con `min-height` reservado.
**Rationale:** Control de densidad de anuncios (preserva UX e INP), cumplimiento RGPD (anuncios solo tras consentimiento), CLS ≈ 0 por reserva de espacio. Auto Ads degradaría CWV de forma impredecible.

### Decisión 9: Glosario como programmatic SEO con publicación escalonada
**Elección:** 100+ términos desde una fuente de datos, generando una página por término con `getStaticPaths()`, publicados en lotes semanales.
**Rationale:** Programmatic SEO escala el long-tail con esfuerzo marginal. La publicación escalonada (~8-10/semana) señala frescura continua a Google en lugar de un volcado único.

## Directory Structure

```
asesoria-fiscal-es/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── wrangler.toml
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── ads.txt                 # ⚠️ OBLIGATORIO AdSense
│   ├── _headers                # cache-control Cloudflare
│   ├── _redirects              # 301
│   └── og/                     # imágenes Open Graph por categoría
├── src/
│   ├── content/
│   │   ├── config.ts           # esquemas Zod
│   │   ├── articulos/          # .md/.mdx — un archivo por artículo
│   │   ├── categorias/         # metadatos de cada categoría (pillar)
│   │   └── autores/            # E-E-A-T: fichas de autor
│   ├── components/
│   │   ├── layout/             # Header, Footer, Nav, Breadcrumbs
│   │   ├── content/            # ArticleCard, ArticleMeta, TOC, RelatedArticles, FAQ, Callout
│   │   ├── ads/                # AdSense, AdInArticle, AdSidebar
│   │   ├── seo/                # BaseHead, SchemaArticle/FAQ/HowTo/Breadcrumb
│   │   └── interactive/        # CalculadoraIRPF/IVA/Cuota, CalendarioFiscal, ComparadorSoftware
│   ├── layouts/                # BaseLayout, ArticleLayout, CategoryLayout, ToolLayout
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── sobre-nosotros.astro
│   │   ├── contacto.astro
│   │   ├── aviso-legal.astro
│   │   ├── politica-privacidad.astro
│   │   ├── politica-cookies.astro
│   │   ├── articulos/[slug].astro
│   │   ├── categoria/[categoria].astro
│   │   ├── glosario/index.astro
│   │   ├── glosario/[slug].astro
│   │   ├── calculadoras/{index,irpf,iva,cuota-autonomos}.astro
│   │   └── calendario-fiscal.astro
│   ├── styles/
│   │   └── global.css          # @import "tailwindcss" + @theme tokens
│   ├── lib/
│   │   ├── seo.ts              # meta/canonical helpers
│   │   ├── schema.ts          # generadores JSON-LD
│   │   ├── reading-time.ts
│   │   └── related.ts         # lógica de relacionados
│   └── data/
│       ├── site.ts            # config global
│       ├── nav.ts             # navegación
│       ├── glosario.json      # 100+ términos
│       └── calendario-2026.json
```

## Data Model

### Colección `articulos`
| Campo | Tipo | Notas |
|-------|------|-------|
| `title` | string ≤60 | título SEO, H1 |
| `description` | string ≤160 | meta description |
| `slug` | string? | opcional, default = nombre archivo |
| `categoria` | reference(categorias) | pillar de pertenencia |
| `autor` | reference(autores) | E-E-A-T |
| `pubDate` | date | orden y datePublished |
| `updatedDate` | date? | dateModified |
| `heroImage` | image()? | astro:assets |
| `keywords` | string[] | KW objetivo + secundarias |
| `cpc` | number? | metadato interno priorización |
| `volumen` | number? | metadato interno priorización |
| `faq` | {q,a}[]? | genera FAQPage |
| `howto` | {paso,detalle}[]? | genera HowTo |
| `draft` | boolean (false) | excluye de producción |
| `featured` | boolean (false) | destacado en home/fallback |

### Colección `categorias`
| Campo | Tipo |
|-------|------|
| `nombre` | string |
| `descripcion` | string |
| `orden` | number |
| `icono` | string? |

### Colección `autores`
| Campo | Tipo |
|-------|------|
| `nombre` | string |
| `bio` | string |
| `credenciales` | string |

### Dato `glosario.json` (por término)
`termino`, `slug`, `definicion`, `definicionAmpliada`, `relacionados[]`, `categoria`, `fechaPublicacion?`.

### Dato `calendario-2026.json` (por evento)
`fecha` (ISO), `modelo`, `descripcion`, `periodo`, `tipo`, `obligatorioPara`.

## Data Flow

### Contenido (artículos)
1. Autor crea `src/content/articulos/<slug>.md` con frontmatter.
2. Zod valida en build; si falla, el build se detiene.
3. `getStaticPaths()` en `articulos/[slug].astro` genera una página por artículo no-draft.
4. `ArticleLayout` resuelve referencias (`categoria`, `autor`), genera TOC desde headings, schema desde `faq`/`howto`, y `RelatedArticles` desde `related.ts`.
5. `@astrojs/sitemap` incluye la URL; las imágenes pasan por `astro:assets`.

### Calculadoras
1. La página `/calculadoras/<x>` (ToolLayout) monta el componente Preact con `client:visible`.
2. Al entrar en viewport, Astro hidrata la isla; el resto de la página sigue siendo HTML estático.
3. El usuario introduce valores → cálculo en cliente (tramos IRPF, IVA repercutido/soportado, tramos de cuota, retención %) → resultado instantáneo.
4. No se cargan anuncios dentro de la herramienta (protege INP).

### Calendario fiscal
1. `calendario-2026.json` es la fuente única.
2. La isla `CalendarioFiscal` lo importa, calcula el próximo vencimiento vs fecha actual, resalta y permite filtrar/exportar `.ics`.
3. El artículo "Calendario fiscal 2026" consume el mismo JSON para la tabla estática (SEO/indexable).

### AdSense + consentimiento
1. `BaseLayout` renderiza el CMP banner.
2. Sin consentimiento → `adsbygoogle.js` no se carga, slots con `min-height` vacíos.
3. Tras aceptar → se carga el script async una vez y se rellenan los slots.
4. Revocación desde `/politica-cookies` → se detiene la carga de anuncios.

## Risks / Trade-offs

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Rechazo de AdSense por contenido insuficiente | Bloquea monetización | Publicar 15-20 artículos de calidad (pilares 1.500+ palabras) antes de solicitar |
| Datos fiscales desactualizados (tramos, fechas) | Pérdida de confianza/E-E-A-T | Centralizar en JSON/calculadora, revisión anual, disclaimer informativo |
| CLS por anuncios | Penalización CWV/ranking | `min-height` reservado en cada slot, slots manuales |
| Sobre-densidad de anuncios | Penalización AdSense/UX | Máx 3 in-article, nada en calculadoras ni home above-the-fold |
| Estacionalidad fuerte (picos abril/julio/oct/ene) | Ingresos irregulares | Mezcla evergreen + estacional; glosario long-tail estable |
| Competidores establecidos en gaps parciales | Dificultad de ranking | Empezar por los 4 gaps puros; superar a competidores en calidad/herramientas |
| Bundle de islas crece | Degrada Lighthouse | Preact + `client:visible`; auditar bundle por isla |

## Migration / Deployment Plan

Proyecto nuevo, sin migración de datos.

**Despliegue (Cloudflare Pages):**
- Build command: `astro build` · Output: `dist` · Node: 20.
- `public/_headers`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, cache inmutable en `/assets/*`.
- `public/_redirects`: 301 que se necesiten (p. ej. trailing slash legacy).
- `astro.config.mjs` con `site` correcto (canonical y sitemap dependen de él).

**Secuencia de lanzamiento (roadmap por fases):**
1. **Fase 0 — Scaffold:** Astro + TW4 + integraciones + colecciones + "hola mundo" desplegado en CF.
2. **Fase 1 — Plantillas:** layouts, Header/Footer/Breadcrumbs, BaseHead + schemas; 1 artículo demo con SEO completo.
3. **Fase 2 — Base navegable:** páginas legales, sobre-nosotros, contacto, home, listados de categoría.
4. **Fase 3 — Artículos 1-7:** redactar y maquetar Fases 1-2 de contenido (los 4 gaps + 3 parciales).
5. **Fase 4 — Interactivas:** calculadoras IRPF/IVA/Cuota/Retenciones, CalendarioFiscal, ComparadorSoftware.
6. **Fase 5 — AdSense:** ads.txt, CMP, componentes Ad, solicitar aprobación.
7. **Fase 6 — Escalado:** artículos 8-10 + glosario (publicación escalonada), optimización CWV, búsqueda Pagefind.

**Checklist bloqueante previo a solicitar AdSense:** ads.txt, robots+sitemap, política de privacidad (menciona AdSense+cookies), política de cookies+CMP, aviso legal+contacto, fichas de autor, disclaimer fiscal, schema validado, reserva de slots, `site` correcto.
