import { useState } from 'preact/hooks';

export interface EventoFiscal {
  fecha: string; // ISO YYYY-MM-DD
  modelo: string;
  descripcion: string;
  periodo: string;
  tipo: 'iva' | 'irpf' | 'retenciones' | 'renta';
  obligatorioPara: string;
}

interface CalendarioFiscalProps {
  events: EventoFiscal[];
}

type TipoEvento = EventoFiscal['tipo'];
type Filtro = 'todos' | TipoEvento;

const FILTROS: { value: Filtro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'iva', label: 'IVA' },
  { value: 'irpf', label: 'IRPF' },
  { value: 'retenciones', label: 'Retenciones' },
  { value: 'renta', label: 'Renta' },
];

const TIPO_BADGE: Record<TipoEvento, string> = {
  iva: 'bg-brand/10 text-brand border-brand/20',
  irpf: 'bg-accent/10 text-accent border-accent/20',
  retenciones: 'bg-amber-50 text-amber-700 border-amber-200',
  renta: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const OBLIGATORIO_LABEL: Record<string, string> = {
  todos: 'Todos los autónomos',
  arrendadores: 'Arrendadores',
  'estimacion-directa': 'Estimación directa',
  intracomunitario: 'Operaciones intracomunitarias',
};

/** Parsea una fecha ISO (YYYY-MM-DD) como medianoche local para evitar desfases. */
const parseFecha = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

const formatFechaLarga = (iso: string): string => {
  const date = parseFecha(iso);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const formatFechaCompacta = (iso: string): string => {
  const date = parseFecha(iso);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
  })
    .format(date)
    .replace('.', '');
};

const diasRestantes = (iso: string, hoy: Date): number => {
  const ms = parseFecha(iso).getTime() - hoy.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const googleCalendarUrl = (event: EventoFiscal): string => {
  const date = parseFecha(event.fecha);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dates = `${yyyy}${mm}${dd}/${yyyy}${mm}${dd}`;
  const text = encodeURIComponent(`${event.modelo} ${event.periodo}`.trim());
  const details = encodeURIComponent(event.descripcion);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
};

export default function CalendarioFiscal({ events }: CalendarioFiscalProps) {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  // Ordenado por fecha (ascendente) — estable para entradas con misma fecha.
  const eventosOrdenados = [...events].sort((a, b) =>
    a.fecha === b.fecha
      ? a.modelo.localeCompare(b.modelo)
      : a.fecha.localeCompare(b.fecha),
  );

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Primer evento no vencido tras el día de hoy.
  const proximoEvento = eventosOrdenados.find(
    (e) => parseFecha(e.fecha).getTime() >= hoy.getTime(),
  );
  const diasProximo = proximoEvento ? diasRestantes(proximoEvento.fecha, hoy) : null;

  const eventosVisibles = eventosOrdenados.filter(
    (e) => filtro === 'todos' || e.tipo === filtro,
  );

  return (
    <div class="space-y-5">
      {/* Banner del próximo vencimiento */}
      {proximoEvento && diasProximo !== null && (
        <div class="rounded-xl border-2 border-brand bg-brand/5 p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-brand">
            Próximo vencimiento
          </p>
          <div class="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 class="text-lg font-bold text-ink">
              {proximoEvento.modelo}
              <span class="ml-2 text-sm font-medium text-muted">
                {proximoEvento.periodo}
              </span>
            </h3>
            <div class="text-right">
              <span class="text-2xl font-extrabold text-brand">
                {diasProximo === 0 ? 'Hoy' : diasProximo}
              </span>
              {diasProximo > 0 && (
                <span class="ml-1 text-sm text-muted">
                  {diasProximo === 1 ? 'día' : 'días'}
                </span>
              )}
            </div>
          </div>
          <p class="mt-2 text-sm text-ink/80">{proximoEvento.descripcion}</p>
          <p class="mt-1 text-sm font-medium text-ink">
            Fecha límite: {formatFechaLarga(proximoEvento.fecha)}
          </p>
          <a
            href={googleCalendarUrl(proximoEvento)}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Añadir recordatorio en Google Calendar
          </a>
        </div>
      )}

      {/* Filtros por tipo */}
      <div
        class="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filtrar por tipo de obligación"
      >
        {FILTROS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFiltro(f.value)}
            aria-pressed={filtro === f.value}
            class={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
              filtro === f.value
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-surface text-ink hover:border-brand hover:text-brand'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Listado de eventos */}
      <div class="space-y-3">
        {eventosVisibles.length === 0 && (
          <p class="rounded-lg border border-line bg-surface p-4 text-sm text-muted">
            No hay eventos que coincidan con este filtro.
          </p>
        )}

        {eventosVisibles.map((event) => {
          const dias = diasRestantes(event.fecha, hoy);
          const esPasado = dias < 0;
          const esProximo =
            !!proximoEvento &&
            event.fecha === proximoEvento.fecha &&
            event.modelo === proximoEvento.modelo &&
            event.periodo === proximoEvento.periodo;

          const estadoTexto = esPasado
            ? 'Vencido'
            : dias === 0
              ? 'Vence hoy'
              : `${dias} ${dias === 1 ? 'día' : 'días'}`;

          const estadoClase = esPasado
            ? 'text-muted'
            : dias <= 7
              ? 'text-red-600 font-semibold'
              : 'text-brand font-semibold';

          return (
            <article
              class={`rounded-lg border bg-surface p-4 transition-colors sm:p-5 ${
                esProximo
                  ? 'border-brand ring-1 ring-brand/30'
                  : 'border-line'
              } ${esPasado ? 'opacity-60' : ''}`}
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${TIPO_BADGE[event.tipo]}`}
                    >
                      {event.tipo}
                    </span>
                    <span class="text-xs text-muted">{event.periodo}</span>
                    {esProximo && (
                      <span class="inline-flex items-center rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                        Próximo
                      </span>
                    )}
                  </div>

                  <h3 class="mt-2 text-base font-bold text-ink sm:text-lg">
                    {event.modelo}
                  </h3>
                  <p class="mt-1 text-sm text-ink/80">{event.descripcion}</p>

                  <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span class="text-muted">
                      <span class="font-medium text-ink">
                        {formatFechaLarga(event.fecha)}
                      </span>
                    </span>
                    <span class="text-muted">
                      Obligatorio para:{' '}
                      <span class="font-medium text-ink">
                        {OBLIGATORIO_LABEL[event.obligatorioPara] ??
                          event.obligatorioPara}
                      </span>
                    </span>
                  </div>
                </div>

                <div class="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <span class={`text-sm ${estadoClase}`}>{estadoTexto}</span>
                  {!esPasado && (
                    <a
                      href={googleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                    >
                      Añadir recordatorio
                    </a>
                  )}
                </div>
              </div>

              {/* Cabecera compacta visible solo en móvil, accesible a lectores */}
              <span class="sr-only">
                Fecha: {formatFechaCompacta(event.fecha)}. {estadoTexto}.
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
