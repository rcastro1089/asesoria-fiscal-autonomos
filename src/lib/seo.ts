import { site } from '../data/site';

export interface SeoMeta {
  title: string;
  description: string;
  /** URL absoluta de la imagen Open Graph. */
  ogImage: string;
  /** URL canónica absoluta. */
  canonical: string;
  ogType: 'website' | 'article';
  noindex: boolean;
}

export interface SeoInput {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

/**
 * Construye una URL absoluta a partir de una ruta y la `site` configurada.
 * Garantiza canonical sin doble barra y respetando trailingSlash:'never'.
 */
export function absoluteUrl(pathname: string, base: URL | string = site.url): string {
  const origin = typeof base === 'string' ? base : base.origin;
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  // Quitar trailing slash salvo la home.
  const clean = path !== '/' ? path.replace(/\/$/, '') : '/';
  return new URL(clean, origin).href;
}

/**
 * Resuelve todos los metadatos SEO con valores por defecto del sitio.
 * `currentUrl` es el `Astro.url` de la página que se está renderizando.
 */
export function resolveSeo(input: SeoInput, currentUrl: URL): SeoMeta {
  const title = input.title
    ? `${input.title} | ${site.shortName}`
    : `${site.name} · Fiscalidad práctica para autónomos`;

  const ogImageRaw = input.ogImage ?? site.defaultOgImage;

  return {
    title: truncate(title, 70),
    description: truncate(input.description ?? site.description, 160),
    ogImage: ogImageRaw.startsWith('http') ? ogImageRaw : absoluteUrl(ogImageRaw),
    canonical: absoluteUrl(currentUrl.pathname),
    ogType: input.ogType ?? 'website',
    noindex: input.noindex ?? false,
  };
}

/** Trunca de forma segura para no romper límites de SERP. */
export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}
