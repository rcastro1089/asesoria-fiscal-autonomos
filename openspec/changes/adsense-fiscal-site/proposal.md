# Proposal: Sitio AdSense Asesoría Fiscal Autónomos España

## Why

Construir un sitio AdSense completo en el nicho "fiscalidad para autónomos digitales" en España. Investigación de keywords (1,529 keywords, $0.517 gastados) confirmó 4 gaps reales sin competidores: IVA deducible, retenciones IRPF, factura electrónica, calendario fiscal. CPC promedio $1-3, competencia baja. Stack: Astro 6 + Tailwind 4 + Cloudflare Pages. El sitio debe ser extremadamente veloz y optimizado para indexación de Google.

## What Changes

- Scaffold completo Astro 6 + Tailwind CSS 4 + Cloudflare Pages + content collections
- 8 categorías de artículos (Modelos Fiscales, Cuota Autónomos, IVA, IRPF, Gastos Deducibles, Facturación Electrónica, Calendario Fiscal, Altas/Bajas)
- 4 calculadoras interactivas (IRPF, IVA, Cuota Autónomos, Retenciones) como Astro Islands
- Glosario fiscal 100+ términos como programmatic SEO + calendario de publicación
- Calendario fiscal interactivo 2026 con recordatorios
- SEO técnico completo (Schema JSON-LD, sitemap, breadcrumbs, meta tags)
- Integración AdSense (componentes, CMP cookies RGPD, ads.txt)
- Páginas legales obligatorias para aprobación AdSense

## Capabilities

### New Capabilities
- `astro-scaffold`: Setup proyecto Astro 6 + Tailwind 4 + CF Pages + content collections + layouts
- `seo-technical`: Schema JSON-LD (Article, FAQPage, HowTo, Breadcrumb), sitemap, meta tags, breadcrumbs, internal linking
- `calculadoras-interactivas`: 4 calculadoras (IRPF, IVA, Cuota, Retenciones) con Preact, client:visible
- `glosario-fiscal`: 100+ páginas programmatic SEO + calendario publicación semanal
- `calendario-fiscal-2026`: Calendario interactivo con plazos y alertas
- `adsense-integration`: Componentes Ad, CMP RGPD, ads.txt, reserva CLS
- `content-articles`: 10 artículos iniciales optimizados por ROI
- `legal-pages`: Privacidad, cookies, aviso legal, contacto, sobre-nosotros

### Modified Capabilities
(ninguna - proyecto nuevo)

## Impact
- Stack: Astro 6 + Tailwind CSS 4 + Preact + Cloudflare Pages
- Dependencias: astro, @astrojs/sitemap, @astrojs/mdx, @astrojs/preact, preact, @tailwindcss/vite, tailwindcss, @tailwindcss/typography
- Hosting: Cloudflare Pages (build: astro build, output: dist)
- Monetización: Google AdSense + Afiliado (gestorías)
