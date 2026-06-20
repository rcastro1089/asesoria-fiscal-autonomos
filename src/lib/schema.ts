import { site } from '../data/site';
import { absoluteUrl } from './seo';

/** JSON-LD genérico. */
export type JsonLd = Record<string, unknown>;

/** Organization (publisher) reutilizado por Article y WebSite. */
export function organizationSchema(): JsonLd {
  return {
    '@type': 'Organization',
    name: site.publisher.name,
    url: site.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(site.publisher.logo),
    },
  };
}

/** WebSite con SearchAction (para sitelinks searchbox). */
export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: site.locale,
    publisher: organizationSchema(),
  };
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: Date;
  dateModified?: Date;
  authorName: string;
  authorUrl?: string;
}

/** Article / BlogPosting con autor, fechas y publisher. */
export function articleSchema(input: ArticleSchemaInput): JsonLd {
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    inLanguage: site.locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    author: {
      '@type': 'Person',
      name: input.authorName,
      ...(input.authorUrl ? { url: input.authorUrl } : {}),
    },
    publisher: organizationSchema(),
    datePublished: input.datePublished.toISOString(),
    dateModified: (input.dateModified ?? input.datePublished).toISOString(),
  };
  if (input.image) {
    schema.image = input.image.startsWith('http') ? input.image : absoluteUrl(input.image);
  }
  return schema;
}

/** FAQPage desde pares pregunta/respuesta. */
export function faqSchema(items: { q: string; a: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/** HowTo desde pasos. */
export function howToSchema(
  name: string,
  steps: { paso: string; detalle: string }[],
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.paso,
      text: step.detalle,
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** BreadcrumbList con URLs absolutas. */
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : absoluteUrl(item.url),
    })),
  };
}
