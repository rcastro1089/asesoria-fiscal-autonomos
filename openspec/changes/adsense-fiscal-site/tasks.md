# Tasks: Sitio AdSense Asesoría Fiscal Autónomos España

## Fase 0 — Scaffold (astro-scaffold)
- [ ] 0.1 Ejecutar `npm create astro@latest` en modo estático y limpiar la plantilla por defecto
- [ ] 0.2 Instalar dependencias: `@astrojs/sitemap`, `@astrojs/mdx`, `@astrojs/preact`, `preact`
- [ ] 0.3 Instalar Tailwind 4: `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/typography`
- [ ] 0.4 Configurar `astro.config.mjs` (site, trailingSlash:'never', build.format:'directory', integraciones, prefetch)
- [ ] 0.5 Crear `src/styles/global.css` con `@import "tailwindcss"`, `@plugin typography` y bloque `@theme` (color-brand, color-accent, font-sans)
- [ ] 0.6 Crear `src/content/config.ts` con la colección `articulos` (esquema Zod completo)
- [ ] 0.7 Añadir las colecciones `categorias` y `autores` a `config.ts`
- [ ] 0.8 Crear `src/data/site.ts` (nombre, url, social, descripción global)
- [ ] 0.9 Crear `src/data/nav.ts` con las 8 categorías + Calculadoras + Calendario + Glosario
- [ ] 0.10 Crear `public/robots.txt` (permitir todo + sitemap, bloquear params de calculadoras)
- [ ] 0.11 Crear `public/_headers` (nosniff, referrer-policy, cache inmutable /assets/*)
- [ ] 0.12 Crear `public/_redirects` y `wrangler.toml` base
- [ ] 0.13 Crear `BaseLayout.astro` (html lang=es, skip-link, slot, Header/Footer placeholders)
- [ ] 0.14 Desplegar "hola mundo" en Cloudflare Pages (build astro build, output dist, Node 20)

## Fase 1 — Plantillas y SEO base (astro-scaffold + seo-technical)
- [ ] 1.1 Crear `components/seo/BaseHead.astro` (title, description, canonical, OG, Twitter, robots, theme-color, hreflang)
- [ ] 1.2 Crear `src/lib/seo.ts` (helpers de meta y canonical absoluta)
- [ ] 1.3 Crear `src/lib/schema.ts` (generadores JSON-LD reutilizables)
- [ ] 1.4 Crear `components/seo/SchemaArticle.astro` (Article/BlogPosting con autor, fechas, publisher)
- [ ] 1.5 Crear `components/seo/SchemaFAQ.astro` (FAQPage desde frontmatter faq)
- [ ] 1.6 Crear `components/seo/SchemaHowTo.astro` (HowTo desde frontmatter howto)
- [ ] 1.7 Crear `components/seo/SchemaBreadcrumb.astro` (BreadcrumbList)
- [ ] 1.8 Crear `components/layout/Header.astro` (logo + Nav, sticky desktop)
- [ ] 1.9 Crear `components/layout/Nav.astro` (menú + drawer mobile accesible)
- [ ] 1.10 Crear `components/layout/Footer.astro` (enlaces legales, categorías, disclaimer fiscal)
- [ ] 1.11 Crear `components/layout/Breadcrumbs.astro` (visual + emite SchemaBreadcrumb)
- [ ] 1.12 Crear `components/content/ArticleMeta.astro` (autor, fechas, tiempo lectura)
- [ ] 1.13 Crear `src/lib/reading-time.ts`
- [ ] 1.14 Crear `components/content/TableOfContents.astro` (desde headings, sticky desktop)
- [ ] 1.15 Crear `components/content/RelatedArticles.astro` + `src/lib/related.ts`
- [ ] 1.16 Crear `components/content/FAQ.astro` (acordeón accesible)
- [ ] 1.17 Crear `components/content/Callout.astro` (tip/aviso/plazo)
- [ ] 1.18 Crear `components/content/ArticleCard.astro` (título, extracto, categoría, fecha, lectura)
- [ ] 1.19 Crear `ArticleLayout.astro` (breadcrumbs, meta, TOC, prose, slots ads, relacionados)
- [ ] 1.20 Crear `pages/articulos/[slug].astro` con `getStaticPaths()` desde la colección
- [ ] 1.21 Integrar `@astrojs/sitemap` con changefreq weekly + filtro de borradores
- [ ] 1.22 Crear ficha de autor demo en `content/autores/` y artículo demo; validar SEO/schema en Rich Results Test

## Fase 2 — Base navegable y páginas legales (legal-pages + astro-scaffold)
- [ ] 2.1 Crear las 8 categorías como `.md` en `content/categorias/` (modelos, cuota, IVA, IRPF, gastos, facturación, calendario, altas/bajas)
- [ ] 2.2 Crear `CategoryLayout.astro` (intro SEO + grid de ArticleCard)
- [ ] 2.3 Crear `pages/categoria/[categoria].astro` con paginación (`paginate()`)
- [ ] 2.4 Crear `pages/index.astro` (hero, categorías destacadas, últimos artículos, CTA calculadoras)
- [ ] 2.5 Crear `pages/404.astro` con sugerencias de artículos populares
- [ ] 2.6 Redactar `pages/politica-privacidad.astro` (RGPD + mención explícita Google AdSense y cookies)
- [ ] 2.7 Redactar `pages/politica-cookies.astro` (clasificación + enlace a panel CMP)
- [ ] 2.8 Redactar `pages/aviso-legal.astro` (LSSI-CE: titular, condiciones, propiedad intelectual)
- [ ] 2.9 Crear `pages/contacto.astro` con formulario (Web3Forms/Cloudflare) + validación
- [ ] 2.10 Redactar `pages/sobre-nosotros.astro` (E-E-A-T: equipo, credenciales, metodología)
- [ ] 2.11 Verificar disclaimer fiscal en Footer presente en todas las páginas
- [ ] 2.12 Generar imágenes Open Graph por categoría en `public/og/`

## Fase 3 — Artículos 1-7 (content-articles)
- [ ] 3.1 Redactar artículo #1 "IVA deducible autónomos" (gap, FAQ, tabla)
- [ ] 3.2 Redactar artículo #2 "Retenciones IRPF autónomos" (gap, FAQ)
- [ ] 3.3 Redactar artículo #3 "Factura electrónica autónomos" (gap, comparativa, afiliado)
- [ ] 3.4 Redactar artículo #4 "Calendario fiscal autónomos 2026" (gap, HowTo)
- [ ] 3.5 Redactar artículo #5 "Tarifa plana autónomos 2026" (parcial, HowTo)
- [ ] 3.6 Redactar artículo #6 "Darse de alta como autónomo" (parcial, HowTo + checklist)
- [ ] 3.7 Redactar artículo #7 "Cuota de autónomos 2026" (pilar 1.500+ palabras)
- [ ] 3.8 Asignar autor con credenciales y fechas pub/actualización a cada artículo
- [ ] 3.9 Cargar frontmatter de priorización (keywords, cpc, volumen) en los 7 artículos
- [ ] 3.10 Implementar enlazado por topic clusters (cluster → pilar y entre hermanos)
- [ ] 3.11 Añadir bloques `faq` a los artículos guía y `howto` a los tutoriales
- [ ] 3.12 Verificar jerarquía H1/H2/H3 y title ≤60 / description ≤160 en los 7

## Fase 4 — Calculadoras y calendario interactivos (calculadoras-interactivas + calendario-fiscal-2026)
- [ ] 4.1 Crear `ToolLayout.astro` (layout de herramientas con contenido SEO + disclaimer)
- [ ] 4.2 Implementar `CalculadoraIRPF.tsx` (tramos progresivos estatales 2026 + tipo medio)
- [ ] 4.3 Implementar `CalculadoraIVA.tsx` (repercutido − soportado, tipos 21/10/4%)
- [ ] 4.4 Implementar `CalculadoraCuota.tsx` (tramos por rendimiento neto + tarifa plana)
- [ ] 4.5 Implementar calculadora de Retenciones (15% general / 7% nuevo autónomo, líquido)
- [ ] 4.6 Crear páginas `/calculadoras/{index,irpf,iva,cuota-autonomos}.astro` con `client:visible`
- [ ] 4.7 Añadir validación de entradas (vacío/negativo) y disclaimer a cada calculadora
- [ ] 4.8 Construir `src/data/calendario-2026.json` con plazos reales AEAT (303,130,390,111,115,180/190,349,renta)
- [ ] 4.9 Implementar `CalendarioFiscal.tsx` (próximo vencimiento + cuenta atrás + filtros)
- [ ] 4.10 Añadir exportación de recordatorio (.ics / Google Calendar) a los eventos
- [ ] 4.11 Crear `pages/calendario-fiscal.astro` (isla + contenido SEO + breadcrumbs)
- [ ] 4.12 Implementar `ComparadorSoftware.tsx` (afiliación facturación electrónica)
- [ ] 4.13 Incrustar cada isla en su artículo correspondiente con `client:visible`
- [ ] 4.14 Auditar bundle de cada isla y confirmar Lighthouse ≥ 95

## Fase 5 — AdSense y monetización (adsense-integration)
- [ ] 5.1 Crear `public/ads.txt` con la línea del publisher
- [ ] 5.2 Implementar `components/ads/AdSense.astro` (wrapper base con data-ad-client/slot + min-height)
- [ ] 5.3 Implementar `components/ads/AdInArticle.astro` (anuncio fluido entre párrafos, máx 3)
- [ ] 5.4 Implementar `components/ads/AdSidebar.astro` (300×600 sticky, solo desktop ≥1024px)
- [ ] 5.5 Implementar banner CMP de cookies (aceptar/rechazar/configurar + persistencia)
- [ ] 5.6 Condicionar la carga de `adsbygoogle.js` async al consentimiento en BaseLayout
- [ ] 5.7 Implementar revocación de consentimiento desde la política de cookies
- [ ] 5.8 Posicionar slots (tras intro, mitad, final) y excluir home above-the-fold y calculadoras
- [ ] 5.9 Marcar enlaces de afiliado con `rel="sponsored"` y divulgación
- [ ] 5.10 Verificar CLS < 0.05 con anuncios y completar checklist bloqueante
- [ ] 5.11 Solicitar aprobación de AdSense (con 15-20 artículos publicados)

## Fase 6 — Escalado y glosario (glosario-fiscal + content-articles)
- [ ] 6.1 Redactar artículo #8 "Modelo 130 autónomos" (tutorial + HowTo)
- [ ] 6.2 Redactar artículo #9 "Declaración de la renta autónomos 2026" (pilar estacional 1.500+)
- [ ] 6.3 Redactar artículo #10 "Gastos deducibles autónomos" (pilar base de enlazado 1.500+)
- [ ] 6.4 Crear `src/data/glosario.json` con los términos núcleo (IRPF, IVA, retención, modelos, etc.)
- [ ] 6.5 Ampliar el glosario hasta superar 100 términos con definiciones y relacionados
- [ ] 6.6 Crear `pages/glosario/[slug].astro` con `getStaticPaths()` (página por término)
- [ ] 6.7 Añadir SEO + schema DefinedTerm + breadcrumb a cada página de término
- [ ] 6.8 Crear `pages/glosario/index.astro` con navegación alfabética A-Z
- [ ] 6.9 Implementar enlazado entre términos relacionados y términos ↔ artículos
- [ ] 6.10 Documentar el calendario de publicación semanal del glosario (~8-10 términos/12 semanas, por prioridad)
- [ ] 6.11 Implementar control de publicación por fecha (términos futuros excluidos del build)
- [ ] 6.12 Integrar búsqueda estática Pagefind
- [ ] 6.13 Optimización final de Core Web Vitals (LCP<2.0s, CLS<0.05, INP<200ms)
- [ ] 6.14 Auditoría SEO final: sitemap, schema, internal linking, hreflang, validación Rich Results
