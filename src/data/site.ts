/**
 * Configuración global del sitio. Fuente única de verdad para metadatos,
 * nombre de marca, URLs sociales y datos del publisher (schema/Organization).
 */
export const site = {
  name: 'Asesoría Fiscal Autónomos',
  shortName: 'Fiscal Autónomos',
  // Debe coincidir con `site` en astro.config.mjs (canonical y sitemap dependen de ello).
  url: 'https://asesoria-fiscal-autonomos.es',
  description:
    'Guías prácticas de fiscalidad para autónomos en España: IVA, IRPF, retenciones, facturación y calendario fiscal. Información clara y actualizada.',
  defaultOgImage: '/og/default.png',
  locale: 'es-ES',
  lang: 'es',
  themeColor: '#1d4ed8',
  // Datos del publisher para JSON-LD (Organization).
  publisher: {
    name: 'Asesoría Fiscal Autónomos',
    logo: '/og/logo.png',
  },
  social: {
    twitter: '@fiscalautonomos',
    twitterUrl: 'https://twitter.com/fiscalautonomos',
  },
  // Disclaimer fiscal obligatorio (E-E-A-T + responsabilidad).
  disclaimer:
    'La información de este sitio tiene carácter divulgativo y no constituye asesoramiento fiscal personalizado. Consulta con un asesor colegiado antes de tomar decisiones.',
} as const;

export type Site = typeof site;
