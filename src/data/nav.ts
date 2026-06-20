/**
 * Navegación principal del sitio. Las 8 categorías fiscales (pillar pages)
 * más las secciones de herramientas (calculadoras, calendario, glosario).
 */
export interface NavItem {
  label: string;
  href: string;
}

/** Categorías fiscales — coinciden con los slugs de la colección `categorias`. */
export const categorias: NavItem[] = [
  { label: 'Modelos', href: '/categoria/modelos' },
  { label: 'Cuota de autónomos', href: '/categoria/cuota' },
  { label: 'IVA', href: '/categoria/iva' },
  { label: 'IRPF', href: '/categoria/irpf' },
  { label: 'Gastos deducibles', href: '/categoria/gastos' },
  { label: 'Facturación', href: '/categoria/facturacion' },
  { label: 'Calendario fiscal', href: '/categoria/calendario' },
  { label: 'Altas y bajas', href: '/categoria/altas-bajas' },
];

/** Herramientas interactivas. */
export const herramientas: NavItem[] = [
  { label: 'Calculadoras', href: '/calculadoras' },
  { label: 'Calendario fiscal', href: '/calendario-fiscal' },
  { label: 'Glosario', href: '/glosario' },
];

/** Menú principal (cabecera). */
export const mainNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  ...categorias,
  ...herramientas,
];

/** Enlaces legales (pie de página). */
export const legalNav: NavItem[] = [
  { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Política de privacidad', href: '/politica-privacidad' },
  { label: 'Política de cookies', href: '/politica-cookies' },
];
