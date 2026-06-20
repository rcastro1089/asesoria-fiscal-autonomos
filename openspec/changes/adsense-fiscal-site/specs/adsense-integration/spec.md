# Spec: adsense-integration

Integración de Google AdSense conforme a UX y Core Web Vitals: componentes de anuncio con reserva de espacio (CLS≈0), CMP de consentimiento de cookies RGPD que condiciona la carga de anuncios, `ads.txt` obligatorio y posicionamiento controlado mediante slots manuales.

## ADDED Requirements

### Requirement: El sitio SHALL incluir ads.txt válido
El sistema SHALL incluir `public/ads.txt` con la línea del publisher de Google AdSense en el formato `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. El archivo MUST servirse en la raíz del dominio (`/ads.txt`).

#### Scenario: ads.txt accesible en la raíz
WHEN un crawler de AdSense solicita `/ads.txt` THEN el servidor MUST devolver el archivo con la línea del publisher.

### Requirement: La carga de AdSense SHALL estar condicionada al consentimiento
El sistema SHALL cargar el script `adsbygoogle.js` de forma asíncrona una única vez en `BaseLayout`, y MUST cargarlo (y mostrar anuncios) únicamente después de que el usuario otorgue consentimiento de cookies vía el CMP. Antes del consentimiento, los anuncios MUST permanecer sin cargar.

#### Scenario: Sin consentimiento no se cargan anuncios
WHEN un usuario nuevo visita el sitio y no ha aceptado cookies THEN el script de AdSense MUST permanecer sin ejecutarse y no se realizan peticiones de anuncios.

#### Scenario: Carga tras aceptar cookies
WHEN el usuario acepta las cookies en el banner THEN el sistema MUST cargar `adsbygoogle.js` y renderizar los slots de anuncios.

### Requirement: El CMP de cookies SHALL cumplir RGPD
El sistema SHALL mostrar un banner de consentimiento de cookies compatible con RGPD que permita aceptar, rechazar y configurar las categorías de cookies, y persista la elección del usuario. El banner MUST bloquear las cookies de terceros (incluidas las de Google AdSense) hasta obtener consentimiento explícito y MUST permitir revocar el consentimiento.

#### Scenario: Opciones aceptar/rechazar/configurar
WHEN el banner de cookies se muestra THEN MUST ofrecer al menos las acciones de aceptar todo, rechazar todo y configurar preferencias.

#### Scenario: Persistencia de la elección
WHEN el usuario ha tomado una decisión sobre las cookies THEN el banner NO MUST volver a mostrarse en visitas posteriores hasta que expire o se revoque el consentimiento.

#### Scenario: Revocación del consentimiento
WHEN el usuario revoca su consentimiento desde la política de cookies THEN el sistema MUST dejar de cargar anuncios y eliminar/no usar las cookies de terceros.

### Requirement: Los componentes de anuncio SHALL reservar espacio para evitar CLS
El sistema SHALL implementar `AdSense.astro` (wrapper base con `data-ad-client`/`data-ad-slot`), `AdInArticle.astro` y `AdSidebar.astro`. Cada slot MUST reservar sus dimensiones con `min-height` para que el desplazamiento acumulativo (CLS) se mantenga por debajo de 0.05.

#### Scenario: Espacio reservado antes de cargar el anuncio
WHEN una página con un slot de anuncio se carga THEN el contenedor del slot MUST tener un `min-height` reservado de modo que la aparición del anuncio no desplace el contenido.

### Requirement: El posicionamiento de anuncios SHALL respetar UX y CWV
El sistema SHALL usar slots manuales (no Auto Ads) y posicionar anuncios: tras el primer párrafo/intro, en mitad del artículo (máx. 3 in-article en posts largos), al final antes de relacionados, y en sidebar sticky 300×600 solo en desktop ≥1024px. El sistema MUST NO colocar anuncios above-the-fold en la home ni dentro de las calculadoras para no afectar la interacción/INP.

#### Scenario: Sin anuncios en calculadoras
WHEN se renderiza una página de calculadora THEN MUST NO insertarse unidades de anuncio dentro de la herramienta interactiva.

#### Scenario: Límite de anuncios in-article
WHEN un artículo largo se renderiza THEN MUST insertarse como máximo 3 anuncios in-article.

#### Scenario: Sidebar solo en desktop
WHEN se visualiza el sitio en un viewport menor a 1024px THEN el `AdSidebar` MUST NO mostrarse.

### Requirement: La monetización SHALL admitir afiliación complementaria
El sistema SHALL permitir insertar enlaces de afiliación (gestorías online y software de facturación electrónica) mediante un componente comparador (`ComparadorSoftware`). Los enlaces de afiliado MUST marcarse con `rel="sponsored"` y divulgarse como contenido afiliado.

#### Scenario: Enlaces de afiliado marcados
WHEN el comparador muestra un enlace de afiliado THEN el enlace MUST incluir `rel="sponsored"` y la página MUST informar de la relación de afiliación.
