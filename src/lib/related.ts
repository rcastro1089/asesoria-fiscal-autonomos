import type { CollectionEntry } from 'astro:content';

type Articulo = CollectionEntry<'articulos'>;

/**
 * Selecciona 3-4 artículos relacionados para internal linking por topic clusters.
 *
 * Estrategia:
 *  1. Misma categoría que el artículo actual, priorizando los que comparten keywords/tags.
 *  2. Si no hay suficientes, completa con artículos `featured` de otras categorías.
 *
 * @param current   artículo que se está renderizando (se excluye del resultado)
 * @param all       todos los artículos publicados (no draft)
 * @param limit     número máximo de relacionados (3-4)
 */
export function getRelatedArticles(
  current: Articulo,
  all: Articulo[],
  limit = 4,
): Articulo[] {
  const candidates = all.filter((a) => a.id !== current.id);
  const currentKeywords = new Set(current.data.keywords ?? []);

  // 1. Misma categoría, puntuados por keywords compartidas.
  const sameCategory = candidates
    .filter((a) => a.data.categoria.id === current.data.categoria.id)
    .map((a) => ({
      article: a,
      score: (a.data.keywords ?? []).filter((k) => currentKeywords.has(k)).length,
    }))
    .sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score;
      // Desempate por fecha de publicación descendente.
      return y.article.data.pubDate.getTime() - x.article.data.pubDate.getTime();
    })
    .map((x) => x.article);

  const result: Articulo[] = sameCategory.slice(0, limit);

  // 2. Fallback con destacados de otras categorías.
  if (result.length < 3) {
    const chosen = new Set(result.map((a) => a.id));
    const featured = candidates
      .filter((a) => a.data.featured && !chosen.has(a.id))
      .sort((x, y) => y.data.pubDate.getTime() - x.data.pubDate.getTime());
    for (const a of featured) {
      if (result.length >= limit) break;
      result.push(a);
    }
  }

  return result.slice(0, limit);
}
