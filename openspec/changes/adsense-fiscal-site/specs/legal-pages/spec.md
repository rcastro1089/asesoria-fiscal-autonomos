# Spec: legal-pages

Páginas legales obligatorias para la aprobación de AdSense y el cumplimiento RGPD/LSSI: política de privacidad, política de cookies, aviso legal, contacto y sobre nosotros (E-E-A-T), más el disclaimer fiscal global.

## ADDED Requirements

### Requirement: La política de privacidad SHALL cumplir RGPD y AdSense
El sistema SHALL crear `/politica-privacidad` que describa el responsable del tratamiento, los datos recogidos, la finalidad, la base legal, los derechos del usuario (acceso, rectificación, supresión, oposición) y los terceros. La política MUST mencionar expresamente el uso de Google AdSense y de cookies de terceros para publicidad personalizada.

#### Scenario: Mención obligatoria de Google AdSense
WHEN se revisa la política de privacidad THEN MUST mencionar explícitamente Google AdSense y el uso de cookies de terceros, requisito para la aprobación de AdSense.

#### Scenario: Derechos del usuario descritos
WHEN un usuario lee la política de privacidad THEN MUST encontrar los derechos RGPD y la vía para ejercerlos.

### Requirement: La política de cookies SHALL detallar las cookies y el consentimiento
El sistema SHALL crear `/politica-cookies` que clasifique las cookies (técnicas, analíticas, publicitarias), identifique las de terceros (Google) y explique cómo aceptar, rechazar y revocar el consentimiento. La página MUST enlazar con el panel de configuración del CMP.

#### Scenario: Revocación accesible desde la política
WHEN el usuario visita la política de cookies THEN MUST poder abrir el panel de configuración del consentimiento para cambiar o revocar su elección.

### Requirement: El aviso legal SHALL identificar al titular del sitio
El sistema SHALL crear `/aviso-legal` con los datos identificativos del titular conforme a la LSSI-CE, las condiciones de uso y la propiedad intelectual. La página MUST incluir la identificación del responsable y los términos de uso del sitio.

#### Scenario: Datos del titular presentes
WHEN se revisa el aviso legal THEN MUST contener la identificación del titular del sitio y las condiciones de uso.

### Requirement: La página de contacto SHALL ofrecer una vía de comunicación
El sistema SHALL crear `/contacto` con un formulario funcional (Cloudflare/Web3Forms) o medio de contacto verificable, como señal de confianza requerida por AdSense. El formulario MUST validar los campos y confirmar el envío.

#### Scenario: Envío de formulario confirmado
WHEN el usuario completa y envía el formulario de contacto con datos válidos THEN el sistema MUST procesar el envío y mostrar una confirmación.

#### Scenario: Validación de campos
WHEN el usuario envía el formulario con campos requeridos vacíos o email inválido THEN el sistema MUST mostrar errores de validación sin enviar.

### Requirement: La página sobre nosotros SHALL aportar E-E-A-T
El sistema SHALL crear `/sobre-nosotros` que explique quién está detrás del sitio, la metodología y la experiencia del equipo, enlazando con las fichas de autor. La página MUST reforzar las señales E-E-A-T exigidas por Google para contenido YMYL (finanzas).

#### Scenario: Metodología y equipo descritos
WHEN un usuario visita "sobre nosotros" THEN MUST encontrar la descripción del equipo, sus credenciales y la metodología editorial.

### Requirement: El disclaimer fiscal SHALL aparecer de forma global
El sistema SHALL mostrar en el footer (y en herramientas y artículos) un disclaimer que indique que el contenido es informativo y no constituye asesoramiento fiscal profesional. El disclaimer MUST estar presente en todas las páginas a través del `Footer`.

#### Scenario: Disclaimer en el footer de todas las páginas
WHEN se renderiza cualquier página THEN el `Footer` MUST mostrar el disclaimer de carácter informativo no vinculante.

### Requirement: Las páginas legales SHALL estar enlazadas y excluidas de anuncios intrusivos
El sistema SHALL enlazar todas las páginas legales desde el `Footer` en todas las páginas. Las páginas legales MUST ser accesibles desde cualquier punto del sitio para satisfacer los requisitos de navegación clara de AdSense.

#### Scenario: Enlaces legales en el footer
WHEN se renderiza el footer THEN MUST incluir enlaces a privacidad, cookies, aviso legal y contacto.
