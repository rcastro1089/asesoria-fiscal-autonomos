# Spec: astro-scaffold

Setup del proyecto Astro 6 + Tailwind CSS 4 + Cloudflare Pages, incluyendo content collections tipadas con Zod y los layouts base reutilizables por todo el sitio.

## ADDED Requirements

### Requirement: Inicialización del proyecto Astro 6 SHALL crear un proyecto estático funcional
El sistema SHALL inicializar un proyecto Astro 6 configurado en modo SSG (output estático) con `astro.config.mjs` que defina `site: 'https://asesoria-fiscal-autonomos.es'`, `trailingSlash: 'never'` y `build.format: 'directory'`. El proyecto MUST instalar las dependencias `astro`, `@astrojs/sitemap`, `@astrojs/mdx`, `@astrojs/preact`, `preact`, `@tailwindcss/vite`, `tailwindcss` y `@tailwindcss/typography`.

#### Scenario: Build de producción genera HTML estático
WHEN se ejecuta `astro build` THEN el sistema genera la carpeta `dist/` con HTML puro pre-renderizado y cero JavaScript en las páginas que no contienen islas interactivas.

#### Scenario: La URL canónica se deriva de site
WHEN se construye cualquier página THEN la URL canónica y las entradas del sitemap MUST usar el valor de `site` definido en `astro.config.mjs` como base absoluta.

### Requirement: Integración de Tailwind CSS 4 SHALL configurarse vía CSS
El sistema SHALL integrar Tailwind CSS 4 mediante el plugin `@tailwindcss/vite` y declarar la configuración de tema en `src/styles/global.css` usando `@import "tailwindcss"`, `@plugin "@tailwindcss/typography"` y un bloque `@theme` con los tokens de marca. El sistema MUST definir las variables `--color-brand`, `--color-accent` y `--font-sans`.

#### Scenario: Tokens de marca disponibles en utilidades
WHEN un componente usa una clase como `text-brand` o `bg-accent` THEN Tailwind 4 resuelve el color a partir de los tokens declarados en el bloque `@theme`.

#### Scenario: Tipografía prose aplicada al cuerpo de artículos
WHEN se renderiza el cuerpo Markdown de un artículo THEN el contenedor MUST aplicar la clase `prose` del plugin typography para estilar headings, listas y tablas.

### Requirement: Content Collections SHALL estar tipadas con Zod
El sistema SHALL definir en `src/content/config.ts` tres colecciones: `articulos`, `categorias` y `autores`, cada una con un esquema Zod. La colección `articulos` MUST validar `title` (max 60), `description` (max 160), `categoria` (reference a categorias), `autor` (reference a autores), `pubDate` (date), `keywords` (array string), y campos opcionales `updatedDate`, `heroImage`, `cpc`, `volumen`, `faq`, `howto`, `draft` (default false) y `featured` (default false).

#### Scenario: Frontmatter inválido detiene el build
WHEN un artículo declara un `title` de más de 60 caracteres o omite `categoria` THEN el build de Astro MUST fallar con un error de validación de Zod indicando el campo incorrecto.

#### Scenario: Referencias entre colecciones resueltas
WHEN un artículo declara `categoria` y `autor` como referencias THEN `getCollection('articulos')` MUST permitir resolver los datos de la categoría y el autor referenciados.

#### Scenario: Artículos en borrador excluidos de producción
WHEN un artículo tiene `draft: true` THEN el build de producción MUST excluirlo de las páginas generadas y del sitemap.

### Requirement: Layouts base SHALL proveer estructura reutilizable
El sistema SHALL crear los layouts `BaseLayout.astro`, `ArticleLayout.astro`, `CategoryLayout.astro` y `ToolLayout.astro` en `src/layouts/`. `BaseLayout.astro` MUST renderizar `<html lang="es">`, incluir `BaseHead`, un skip-link de accesibilidad, `Header`, `<slot/>` y `Footer`, y cargar el script de AdSense de forma async condicionada al consentimiento.

#### Scenario: Idioma declarado en el documento
WHEN se renderiza cualquier página THEN el elemento `<html>` MUST incluir el atributo `lang="es"`.

#### Scenario: ArticleLayout compone TOC, ads y meta
WHEN se renderiza un artículo THEN `ArticleLayout.astro` MUST incluir `Breadcrumbs`, `ArticleMeta`, `TableOfContents`, el cuerpo en contenedor `prose`, los slots de anuncios y `RelatedArticles`.

### Requirement: Despliegue en Cloudflare Pages SHALL estar configurado
El sistema SHALL incluir los archivos `public/_headers`, `public/_redirects` y `public/robots.txt`, y documentar el comando de build (`astro build`), el directorio de salida (`dist`) y la versión de Node (20). El archivo `_headers` MUST aplicar `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y `Cache-Control` inmutable a `/assets/*`.

#### Scenario: Cache inmutable para assets versionados
WHEN Cloudflare sirve un archivo bajo `/assets/*` THEN la respuesta MUST incluir `Cache-Control: public, max-age=31536000, immutable`.

#### Scenario: Robots permite indexación y referencia el sitemap
WHEN un crawler lee `/robots.txt` THEN el archivo MUST permitir el rastreo general y referenciar la URL absoluta del `sitemap.xml`.
