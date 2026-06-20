# Spec: calendario-fiscal-2026

Calendario fiscal interactivo 2026 para autónomos: única fuente de datos JSON con los plazos reales de la AEAT, isla interactiva que resalta el próximo vencimiento y filtra por modelo/trimestre, y artículo evergreen renovable anualmente.

## ADDED Requirements

### Requirement: El calendario SHALL tener una única fuente de datos de plazos
El sistema SHALL almacenar todos los plazos fiscales en `src/data/calendario-2026.json` como única fuente de verdad, reutilizable tanto por la isla interactiva como por el artículo. Cada evento MUST tener `fecha` (ISO), `modelo`, `descripcion`, `periodo` (trimestre/anual), `tipo` (IVA, IRPF, retenciones, informativa) y `obligatorioPara` (perfil de autónomo).

#### Scenario: Carga de eventos desde JSON
WHEN se renderiza el calendario THEN tanto la isla interactiva como el artículo MUST leer los eventos desde `calendario-2026.json` sin duplicar datos.

### Requirement: El calendario SHALL incluir los plazos reales de la AEAT 2026
El sistema SHALL incluir como mínimo los siguientes vencimientos reales para autónomos en 2026: modelo 303 (IVA trimestral) y modelo 130 (pago fraccionado IRPF) con vencimiento el 30 de enero (4T 2025), 20 de abril (1T), 20 de julio (2T) y 20 de octubre (3T); modelo 390 (resumen anual IVA) el 30 de enero; modelos 111 y 115 (retenciones) el 20 de enero, 20 de abril, 20 de julio y 20 de octubre; modelos 180/190 (resúmenes anuales de retenciones) el 31 de enero; modelo 349 (operaciones intracomunitarias) el día 20; y la campaña de la Renta 2025 (modelo 100) entre abril y el 30 de junio de 2026. Los datos MUST poder actualizarse a años posteriores cambiando solo el JSON.

#### Scenario: Vencimientos trimestrales presentes
WHEN se consulta el calendario THEN MUST contener las cuatro fechas trimestrales del modelo 303 y del modelo 130 con sus fechas correctas.

#### Scenario: Campaña de la Renta presente
WHEN se consulta el calendario THEN MUST incluir el periodo de la campaña de la Renta 2025 con su fecha límite del 30 de junio de 2026.

### Requirement: La isla interactiva SHALL resaltar el próximo vencimiento
El sistema SHALL implementar `CalendarioFiscal.tsx` como Astro Island (`client:visible`) que calcule, respecto a la fecha actual, cuál es el próximo plazo y lo resalte, mostrando los días restantes. La isla MUST permitir filtrar los eventos por tipo de modelo y por trimestre.

#### Scenario: Próximo plazo resaltado con cuenta atrás
WHEN el usuario abre el calendario THEN la isla MUST identificar el evento futuro más cercano a la fecha actual, resaltarlo y mostrar los días que faltan.

#### Scenario: Filtro por modelo
WHEN el usuario filtra por "IVA (modelo 303)" THEN la isla MUST mostrar únicamente los eventos de ese tipo.

#### Scenario: Eventos pasados diferenciados
WHEN un plazo ya venció respecto a la fecha actual THEN la isla MUST mostrarlo visualmente diferenciado (atenuado o marcado como pasado).

### Requirement: El calendario SHALL exponer recordatorios exportables
El sistema SHALL permitir al usuario añadir un plazo a su calendario personal mediante exportación de evento (enlace de Google Calendar o archivo `.ics`). Cada evento MUST ofrecer una acción para crear el recordatorio con la fecha y descripción del vencimiento.

#### Scenario: Exportar un plazo a calendario personal
WHEN el usuario pulsa "añadir recordatorio" en un evento THEN el sistema MUST generar un enlace/archivo de calendario con la fecha, título (modelo y periodo) y descripción del vencimiento.

### Requirement: La página y el artículo del calendario SHALL ser indexables
El sistema SHALL crear la página `/calendario-fiscal` con la isla interactiva más contenido SEO, e integrar el mismo dato en el artículo "Calendario fiscal autónomos 2026". La página MUST emitir schema apropiado y breadcrumbs, y estar optimizada para la keyword "calendario fiscal autonomos 2026".

#### Scenario: Página optimizada para la keyword objetivo
WHEN se renderiza `/calendario-fiscal` THEN el title y H1 MUST incluir la keyword "calendario fiscal autónomos 2026" y la página MUST incluir breadcrumbs y meta tags.
