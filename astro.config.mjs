// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// URL temporal hasta configurar el dominio definitivo en Cloudflare Pages.
const SITE_URL = 'https://asesoria-fiscal-autonomos.es';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    mdx(),
    preact({ compat: true }),
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      // Excluir borradores y rutas con parámetros de calculadoras del sitemap.
      filter: (page) =>
        !page.includes('/borrador/') &&
        !page.includes('?'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
