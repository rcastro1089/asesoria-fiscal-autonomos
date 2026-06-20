# Spec: glosario-fiscal

Glosario fiscal de más de 100 términos generado como programmatic SEO desde una colección de datos, con página índice navegable, páginas individuales por término, enlazado interno automático con artículos, y un calendario de publicación semanal escalonado.

## ADDED Requirements

### Requirement: El glosario SHALL generarse como programmatic SEO desde una fuente de datos
El sistema SHALL definir una colección o archivo de datos `glosario` con al menos 100 términos fiscales, cada uno con `termino`, `slug`, `definicion`, `definicionAmpliada`, `relacionados` (slugs de otros términos) y `categoria`. El sistema MUST generar una página estática por término vía `getStaticPaths()` en una ruta `/glosario/[slug]`.

#### Scenario: Generación de una página por término
WHEN el build se ejecuta con 100 términos en la fuente de datos THEN el sistema MUST generar 100 páginas individuales bajo `/glosario/`.

#### Scenario: Validación de unicidad de slug
WHEN dos términos comparten el mismo `slug` THEN el build MUST fallar indicando el slug duplicado.

### Requirement: Cada página de término SHALL incluir SEO y schema
El sistema SHALL renderizar cada término con `BaseHead` (title, description, canonical), breadcrumb `Inicio › Glosario › Término` y schema `DefinedTerm` o `Article` JSON-LD. El title MUST incluir el término y la description MUST resumir la definición en ≤ 160 caracteres.

#### Scenario: Meta description derivada de la definición
WHEN se renderiza una página de término THEN la meta description MUST generarse a partir de la definición corta truncada a 160 caracteres.

### Requirement: La página índice del glosario SHALL ser navegable alfabéticamente
El sistema SHALL crear `/glosario/` con un listado de todos los términos publicados, agrupados o filtrables alfabéticamente (A-Z). La página índice MUST enlazar a cada término individual.

#### Scenario: Navegación alfabética
WHEN el usuario visita `/glosario/` THEN la página MUST mostrar los términos organizados por inicial con anclas para saltar a cada letra.

### Requirement: El glosario SHALL enlazarse internamente con artículos y entre términos
El sistema SHALL enlazar cada término con sus términos `relacionados` y permitir que los artículos referencien términos del glosario. Cada página de término MUST mostrar enlaces a los términos relacionados y, cuando existan, a artículos que traten ese concepto.

#### Scenario: Enlaces a términos relacionados
WHEN un término declara `relacionados` THEN su página MUST mostrar enlaces a las páginas de esos términos.

### Requirement: El glosario SHALL seguir un calendario de publicación semanal
El sistema SHALL documentar un calendario de publicación escalonado que libere los términos en lotes semanales para señalar frescura de contenido a Google, en lugar de publicar los 100+ términos de golpe. El calendario MUST cubrir un mínimo de 100 términos repartidos en lotes semanales y MUST priorizar primero los términos con mayor relevancia fiscal/CPC.

#### Scenario: Lotes semanales planificados
WHEN se consulta el calendario de publicación THEN MUST especificar para cada semana qué términos se publican (p. ej. ~8-10 términos/semana durante ~12 semanas) y el orden de prioridad.

#### Scenario: Control de publicación por fecha
WHEN un término tiene una fecha de publicación futura THEN MUST poder marcarse como pendiente para no incluirse en el build de producción hasta esa fecha.

### Requirement: El conjunto inicial de términos SHALL cubrir el vocabulario fiscal del nicho
El sistema SHALL incluir, entre los 100+ términos, al menos: IRPF, IVA, IVA repercutido, IVA soportado, retención, rendimiento neto, base imponible, cuota de autónomos, tarifa plana, RETA, epígrafe IAE, modelo 130, modelo 131, modelo 303, modelo 349, modelo 390, modelo 100, modelo 111, modelo 115, modelo 036/037, recargo de equivalencia, estimación directa, estimación objetiva (módulos), gasto deducible, amortización, autoliquidación, domiciliación, aplazamiento, recargo, sanción, factura simplificada, factura electrónica, Verifactu, SII, autónomo societario, pluriactividad, cese de actividad y prorrata. El conjunto MUST ampliarse hasta superar los 100 términos.

#### Scenario: Cobertura mínima de términos núcleo
WHEN se revisa la fuente de datos del glosario THEN MUST contener al menos los términos núcleo listados además de términos complementarios hasta superar los 100.
