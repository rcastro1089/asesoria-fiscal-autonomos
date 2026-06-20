# Spec: seo-technical

SEO técnico completo: Schema JSON-LD (Article, FAQPage, HowTo, BreadcrumbList, WebSite, Organization), sitemap XML automático, meta tags y Open Graph, breadcrumbs e internal linking automatizado por topic clusters.

## ADDED Requirements

### Requirement: Meta tags y Open Graph SHALL generarse en todas las páginas
El sistema SHALL implementar `BaseHead.astro` que reciba `title`, `description`, `canonical` e imagen OG, y emita las etiquetas `<title>`, `meta description`, `link rel="canonical"` absoluta, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`), Twitter Card, `robots`, `theme-color` y `hreflang="es-ES"`. El title MUST tener ≤ 60 caracteres y la description ≤ 160.

#### Scenario: Canonical absoluta auto-generada
WHEN se renderiza cualquier página THEN `BaseHead` MUST emitir un `link rel="canonical"` con la URL absoluta basada en `site` y la ruta de la página.

#### Scenario: Imagen OG por defecto cuando falta
WHEN una página no define imagen Open Graph propia THEN `BaseHead` MUST usar una imagen OG por defecto de la categoría o del sitio.

### Requirement: Schema JSON-LD SHALL inyectarse según el tipo de página
El sistema SHALL crear componentes `SchemaArticle.astro`, `SchemaFAQ.astro`, `SchemaHowTo.astro` y `SchemaBreadcrumb.astro` que inyecten `<script type="application/ld+json">`. Los artículos MUST emitir schema `Article`/`BlogPosting` con autor, fechas de publicación y actualización, y publisher. Las páginas con bloque `faq` MUST emitir `FAQPage` y los tutoriales con bloque `howto` MUST emitir `HowTo`.

#### Scenario: Article schema con autor y fechas
WHEN se renderiza un artículo THEN el JSON-LD `Article` MUST incluir `headline`, `author`, `datePublished`, `dateModified` (si existe `updatedDate`) y `publisher` con el nombre de la organización.

#### Scenario: FAQPage generado desde frontmatter
WHEN un artículo declara un array `faq` en el frontmatter THEN el sistema MUST generar automáticamente el schema `FAQPage` con cada par pregunta/respuesta.

#### Scenario: HowTo generado desde frontmatter
WHEN un artículo declara un array `howto` THEN el sistema MUST generar el schema `HowTo` con cada paso como `HowToStep`.

#### Scenario: Schema validable en Rich Results Test
WHEN se valida la página en la herramienta Rich Results Test de Google THEN el JSON-LD MUST pasar sin errores.

### Requirement: Sitemap XML SHALL generarse automáticamente
El sistema SHALL integrar `@astrojs/sitemap` con `changefreq: 'weekly'` y un filtro que excluya rutas de borrador. El sitemap MUST incluir todas las páginas públicas (home, artículos, categorías, calculadoras, calendario y páginas legales) y MUST excluir artículos `draft` y rutas de parámetros de calculadoras.

#### Scenario: Borradores excluidos del sitemap
WHEN se genera el sitemap THEN las rutas que coincidan con el filtro de borrador MUST quedar excluidas del XML.

### Requirement: Breadcrumbs SHALL renderizarse y emitir schema
El sistema SHALL implementar `Breadcrumbs.astro` que muestre la jerarquía visual `Inicio › Categoría › Artículo` y emita `BreadcrumbList` JSON-LD vía `SchemaBreadcrumb`. Todas las páginas internas MUST incluir breadcrumbs.

#### Scenario: Breadcrumb refleja la jerarquía real
WHEN se renderiza un artículo de la categoría "IVA" THEN el breadcrumb MUST mostrar Inicio › IVA › Título del artículo y el `BreadcrumbList` MUST tener tres ítems en ese orden.

### Requirement: Internal linking SHALL automatizarse por topic clusters
El sistema SHALL implementar `RelatedArticles.astro` y la lógica en `src/lib/related.ts` que seleccione 3-4 artículos de la misma categoría o que compartan tags. Cada categoría MUST funcionar como pillar page y los artículos cluster MUST enlazar al pilar y entre sí.

#### Scenario: Artículos relacionados por categoría compartida
WHEN se renderiza un artículo THEN `RelatedArticles` MUST mostrar entre 3 y 4 artículos de la misma categoría (excluyendo el actual), priorizando los que compartan tags.

#### Scenario: Sin relacionados suficientes hace fallback
WHEN una categoría tiene menos de 3 artículos publicados THEN `RelatedArticles` MUST completar con artículos destacados (`featured`) de otras categorías.

### Requirement: Core Web Vitals SHALL cumplir umbrales objetivo
El sistema SHALL optimizar para LCP < 2.0s, CLS < 0.05 e INP < 200ms. Las imágenes MUST usar `astro:assets` con formato WebP/AVIF, carga lazy y atributos `width`/`height` explícitos para evitar CLS.

#### Scenario: Imágenes con dimensiones reservadas
WHEN se renderiza una imagen de contenido THEN MUST incluir `width` y `height` para reservar el espacio y evitar saltos de layout.
