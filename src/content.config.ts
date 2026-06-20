import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colección `articulos` — artículos de fiscalidad (Markdown/MDX).
 * Content Layer API (glob loader). El `id` de cada entrada = nombre de archivo.
 * Frontmatter validado con Zod: cualquier error detiene el build.
 */
const articulos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articulos' }),
  schema: ({ image }) =>
    z.object({
      // SEO: el title es el H1 y la <title>; max 60 para evitar truncado en SERP.
      title: z.string().max(60),
      // Meta description; max 160 para evitar truncado en SERP.
      description: z.string().max(160),
      // Referencias a otras colecciones (pillar + autor para E-E-A-T).
      categoria: reference('categorias'),
      autor: reference('autores'),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      // Keyword objetivo + secundarias.
      keywords: z.array(z.string()).default([]),
      // Metadatos internos de priorización editorial (no se renderizan).
      cpc: z.number().optional(),
      volumen: z.number().optional(),
      // Bloques estructurados que generan schema JSON-LD.
      faq: z
        .array(
          z.object({
            q: z.string(),
            a: z.string(),
          }),
        )
        .optional(),
      howto: z
        .array(
          z.object({
            paso: z.string(),
            detalle: z.string(),
          }),
        )
        .optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
});

/**
 * Colección `categorias` — cada categoría es un pillar page del topic cluster.
 */
const categorias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/categorias' }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    orden: z.number().default(0),
    icono: z.string().optional(),
  }),
});

/**
 * Colección `autores` — fichas de autor (E-E-A-T).
 */
const autores = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/autores' }),
  schema: z.object({
    nombre: z.string(),
    bio: z.string(),
    credenciales: z.string(),
    avatar: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

export const collections = { articulos, categorias, autores };
