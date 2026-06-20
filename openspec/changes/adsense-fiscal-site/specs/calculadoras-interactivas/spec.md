# Spec: calculadoras-interactivas

Cuatro calculadoras fiscales interactivas (IRPF, IVA, Cuota de Autónomos y Retenciones IRPF) implementadas como Astro Islands con Preact, hidratadas con `client:visible` para no penalizar el First Load ni los Core Web Vitals.

## ADDED Requirements

### Requirement: Las calculadoras SHALL cargarse como Astro Islands con Preact
El sistema SHALL implementar cada calculadora como componente Preact (`.tsx`) en `src/components/interactive/` e hidratarla con `client:visible`. El bundle de cada isla MUST usar Preact (no React completo) para minimizar el JavaScript enviado y mantener Lighthouse ≥ 95.

#### Scenario: Hidratación diferida al hacer scroll
WHEN el usuario carga una página con una calculadora pero no ha hecho scroll hasta ella THEN el JavaScript de la isla MUST permanecer sin descargar/ejecutar hasta que el componente entre en el viewport.

#### Scenario: Cálculo sin recargar la página
WHEN el usuario cambia un valor de entrada en una calculadora hidratada THEN el resultado MUST recalcularse en cliente de forma instantánea sin recargar la página.

### Requirement: La CalculadoraIRPF SHALL calcular el IRPF por tramos estatales
El sistema SHALL implementar `CalculadoraIRPF.tsx` que reciba el rendimiento neto anual y calcule la cuota de IRPF aplicando los tramos progresivos estatales 2026: hasta 12.450€ al 19%, de 12.450€ a 20.200€ al 24%, de 20.200€ a 35.200€ al 30%, de 35.200€ a 60.000€ al 37%, de 60.000€ a 300.000€ al 45%, y más de 300.000€ al 47%. El cálculo MUST aplicar cada tipo solo a la porción de base que cae dentro de su tramo (progresividad por tramos).

#### Scenario: Cálculo progresivo correcto
WHEN el usuario introduce un rendimiento neto de 30.000€ THEN la calculadora MUST aplicar 19% a los primeros 12.450€, 24% al tramo 12.450–20.200€ y 30% al tramo 20.200–30.000€, y mostrar la cuota total resultante y el tipo medio efectivo.

#### Scenario: Entrada vacía o negativa
WHEN el usuario deja el campo vacío o introduce un valor negativo THEN la calculadora MUST mostrar 0€ o un mensaje de validación sin lanzar error.

### Requirement: La CalculadoraIVA SHALL calcular el IVA a liquidar
El sistema SHALL implementar `CalculadoraIVA.tsx` que permita introducir el IVA repercutido (en facturas emitidas) y el IVA soportado deducible (en gastos), soportando los tipos 21% (general), 10% (reducido) y 4% (superreducido). El resultado a liquidar MUST calcularse como `IVA repercutido − IVA soportado deducible`.

#### Scenario: Resultado a pagar
WHEN el IVA repercutido es 2.100€ y el IVA soportado deducible es 800€ THEN la calculadora MUST mostrar un resultado a pagar de 1.300€.

#### Scenario: Resultado a compensar/devolver
WHEN el IVA soportado deducible supera al IVA repercutido THEN la calculadora MUST mostrar un resultado negativo indicado como "a compensar o devolver".

#### Scenario: Cálculo de IVA desde base imponible
WHEN el usuario introduce una base imponible y selecciona un tipo (21%, 10% o 4%) THEN la calculadora MUST calcular la cuota de IVA correspondiente y el total con IVA.

### Requirement: La CalculadoraCuota SHALL estimar la cuota de autónomos por ingresos reales
El sistema SHALL implementar `CalculadoraCuota.tsx` que estime la cuota mensual de la Seguridad Social 2026 según el sistema de cotización por rendimientos netos reales (tramos de ingresos), y contemple la tarifa plana reducida para nuevos autónomos. La calculadora MUST mapear el rendimiento neto mensual al tramo de cotización correspondiente y devolver la cuota mensual estimada.

#### Scenario: Tramo según rendimiento neto
WHEN el usuario introduce un rendimiento neto mensual THEN la calculadora MUST identificar el tramo de cotización aplicable y mostrar la cuota mensual estimada y la base de cotización asociada.

#### Scenario: Tarifa plana para nuevo autónomo
WHEN el usuario marca la opción "nuevo autónomo" (primer año) THEN la calculadora MUST aplicar la cuota reducida de tarifa plana en lugar de la cuota por tramos.

### Requirement: La CalculadoraRetenciones SHALL calcular la retención de IRPF en factura
El sistema SHALL implementar la calculadora de retenciones que aplique el tipo de retención de IRPF sobre la base imponible de la factura: 15% general para profesionales y 7% reducido para nuevos autónomos durante el año de alta y los dos siguientes. El importe líquido MUST calcularse como `base + IVA − retención`.

#### Scenario: Retención general del 15%
WHEN la base de la factura es 1.000€, el IVA al 21% y la retención al 15% THEN la calculadora MUST mostrar IVA 210€, retención 150€ e importe líquido a cobrar de 1.060€.

#### Scenario: Retención reducida del 7%
WHEN el usuario selecciona el supuesto de nuevo autónomo THEN la calculadora MUST aplicar el 7% de retención sobre la base imponible.

### Requirement: Las calculadoras SHALL tener páginas dedicadas e indexables
El sistema SHALL crear las páginas `/calculadoras/`, `/calculadoras/irpf`, `/calculadoras/iva` y `/calculadoras/cuota-autonomos` usando `ToolLayout.astro`. Cada página MUST incluir contenido explicativo SEO alrededor de la calculadora y un disclaimer de carácter informativo no vinculante.

#### Scenario: Página índice lista las calculadoras
WHEN el usuario visita `/calculadoras/` THEN la página MUST mostrar enlaces a cada calculadora con una breve descripción.

#### Scenario: Disclaimer presente en cada herramienta
WHEN se renderiza cualquier calculadora THEN la página MUST incluir un aviso de que el resultado es una estimación orientativa y no constituye asesoramiento fiscal profesional.
