# Spec: content-articles

Los primeros 10 artículos, priorizados por ROI según la investigación de keywords (gaps reales + CPC + volumen), redactados como contenido de calidad con la estructura E-E-A-T, frontmatter tipado, schema y enlazado por topic clusters.

## ADDED Requirements

### Requirement: Los artículos SHALL priorizarse por ROI de la investigación
El sistema SHALL publicar los 10 artículos iniciales en el orden de ROI definido por la investigación: (1) IVA deducible autónomos, (2) Retenciones IRPF autónomos, (3) Factura electrónica autónomos, (4) Calendario fiscal autónomos 2026, (5) Tarifa plana autónomos 2026, (6) Darse de alta como autónomo, (7) Cuota de autónomos 2026, (8) Modelo 130 autónomos, (9) Declaración de la renta autónomos 2026, (10) Gastos deducibles autónomos. Cada artículo MUST declarar su keyword objetivo, volumen y CPC en el frontmatter.

#### Scenario: Fase 1 cubre los gaps puros
WHEN se publican los primeros 4 artículos THEN MUST corresponder a los 4 gaps reales (IVA deducible, retenciones IRPF, factura electrónica, calendario fiscal) donde ningún competidor rankea.

#### Scenario: Metadatos de priorización presentes
WHEN se inspecciona el frontmatter de un artículo THEN MUST incluir `keywords`, y los metadatos internos `cpc` y `volumen` usados para priorización.

### Requirement: Cada artículo SHALL cumplir la estructura SEO on-page
El sistema SHALL redactar cada artículo con un H1 único igual al título, jerarquía limpia de H2/H3 (que alimenta el TOC y los featured snippets), title ≤ 60 caracteres con la keyword al inicio, meta description ≤ 160 con CTA, e imágenes con `alt` descriptivo. Los artículos pilar MUST superar las 1.500 palabras.

#### Scenario: Pilares con extensión suficiente
WHEN se publica un artículo pilar (cuota de autónomos, declaración de la renta, gastos deducibles) THEN MUST tener al menos 1.500 palabras.

#### Scenario: Jerarquía de encabezados válida
WHEN se renderiza un artículo THEN MUST tener exactamente un H1 y una jerarquía coherente de H2/H3 sin saltos de nivel.

### Requirement: Los artículos SHALL incluir bloques FAQ/HowTo donde aplique
El sistema SHALL incluir en el frontmatter un bloque `faq` en los artículos guía y un bloque `howto` en los tutoriales (darse de alta, modelo 130), que generan automáticamente el schema correspondiente. Los artículos tipo tutorial MUST incluir pasos en `howto`.

#### Scenario: FAQ en artículos guía
WHEN se publica un artículo guía (p. ej. IVA deducible) THEN MUST incluir un bloque `faq` con preguntas frecuentes reales del nicho.

#### Scenario: HowTo en tutoriales
WHEN se publica el artículo "Darse de alta como autónomo" THEN MUST incluir un bloque `howto` con los pasos del proceso.

### Requirement: Los artículos SHALL integrar las herramientas interactivas pertinentes
El sistema SHALL incrustar las islas interactivas en los artículos relacionados: CalculadoraIVA en "IVA deducible", CalculadoraIRPF/Retenciones en "Retenciones IRPF", CalculadoraCuota en "Cuota de autónomos", CalendarioFiscal en "Calendario fiscal" y ComparadorSoftware en "Factura electrónica". La incrustación MUST usar `client:visible`.

#### Scenario: Calculadora incrustada en su artículo
WHEN se renderiza el artículo "Cuota de autónomos 2026" THEN MUST incrustar la CalculadoraCuota como isla `client:visible`.

### Requirement: Los artículos SHALL enlazarse en topic clusters
El sistema SHALL enlazar cada artículo cluster a su pillar page y a artículos hermanos. El mapeo MUST seguir: pilar "Cuota de autónomos" ← tarifa plana; pilar "Gastos deducibles" ← IVA deducible; pilar "IRPF y retenciones" ← retenciones y renta; pilar "Modelos fiscales" ← modelo 130; pilar "Facturación electrónica" ← factura electrónica; pilar "Calendario fiscal" ← calendario; pilar "Altas y bajas" ← alta autónomo.

#### Scenario: Enlace al pilar correspondiente
WHEN se publica "Tarifa plana autónomos 2026" THEN MUST enlazar contextualmente a la pillar page "Cuota de autónomos".

### Requirement: Los artículos SHALL incluir señales E-E-A-T y disclaimer
El sistema SHALL asignar a cada artículo un `autor` referenciado con credenciales, mostrar fecha de publicación y actualización vía `ArticleMeta`, e incluir el disclaimer fiscal. Cada artículo MUST mostrar autor con enlace a su ficha y un aviso de carácter informativo no vinculante.

#### Scenario: Autor con credenciales visible
WHEN se renderiza un artículo THEN `ArticleMeta` MUST mostrar el autor enlazado a su ficha con sus credenciales y las fechas de publicación/actualización.
