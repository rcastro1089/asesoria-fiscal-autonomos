/**
 * Calcula el tiempo de lectura estimado en minutos a partir del texto plano.
 * Velocidad media de lectura en español: ~200 palabras/minuto.
 */
const WORDS_PER_MINUTE = 200;

export function readingTime(content: string): number {
  const words = content
    .replace(/<[^>]*>/g, ' ') // quitar HTML
    .replace(/[#*_>`~\-]/g, ' ') // quitar marcas Markdown
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Formatea el tiempo de lectura como texto legible. */
export function readingTimeLabel(content: string): string {
  return `${readingTime(content)} min de lectura`;
}
