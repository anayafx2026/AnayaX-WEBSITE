# Validación Anaya FX
## Intro con deslizamiento de letras
- `pnpm check`: PASS después de sustituir scaleX por traslaciones y máscaras fijas.
- Navegador: observadas las fases symbol → title → fx → compact → dock → done. AN se traslada hacia la izquierda y YA hacia la derecha manteniendo escala 1; las letras vuelven a las posiciones ocultas antes de dock.
- Capturas de title, fx y compact verifican el recorte y la composición del logotipo. Video pausado hasta compact y reproduciéndose desde dock; consola de la secuencia sin errores ni warnings.
- Ascenso inicial del símbolo, destino superior y transición del video conservados. La nueva versión de intro se muestra una vez por pestaña mediante una clave de sesión nueva.

Fecha: 19 septiembre 2026.
Entorno: Windows, Node 22.23.2, pnpm 10.34.5, Next.js 16.3.5.
Base: fullstack_website_starter; proyecto local Anaya FX.

## Verificación completa
pnpm check: PASS.
- Documentación, ESLint y TypeScript: OK.
- 9 pruebas de configuración y salud: PASS.
- Build optimizado: OK.
- Smoke: 20 páginas con H1 único y canonical; identidad Anaya, recursos permitidos, 404, health, cabeceras y noindex.
- 3 rutas heredadas verificadas como redirecciones.
- PNG y video suministrados disponibles por HTTP.
- Ningún iframe; imágenes limitadas a /brand; video real sólo en portada y sin atributo autoplay.

## Navegador
Chromium integrado, servidor de producción en http://127.0.0.1:3000/.
- Logo completo comprobado visualmente en escritorio y 390 × 844.
- Durante fase FX: video pausado, currentTime 0.
- Durante fase dock: video activo y mudo, currentTime 0.057516. Se comprobó el inicio del video durante el ascenso del símbolo.
- Video local compatible: duración 33.111667 s, readyState 4, sin error de decodificación.
- Escape durante la intro (ya no hay botón Skip intro): pasa a done, cierra dialog y arranca video.
- Menú móvil: identidad completa, cinco rutas, correo y cierre.
- Portfolio móvil: filtro Virtual Prod & XR muestra 1 proyecto; sin overflow.
- Contacto: rechazo de vacío/email inválido, selección de servicio, revisión con foco y mailto correcto a studio@anayafx.com.
- Borrador revisado sin abrir cliente de correo ni enviar mensajes.
- Carrusel desktop: Next service selecciona Show Direction & Previz.
- Estudio desktop: jerarquía, textos y espacio blanco comprobados.
- Viewports 390 × 844 y 1440 × 900: sin overflow horizontal.
- Consola: sin errores o warnings recogidos en la revisión final.

## Gallery, List y tema — 20 septiembre 2026
- `pnpm check`: PASS tras introducir ServiceGallery, ServiceList y ThemeContext.
- Home: Gallery muestra los seis servicios como tarjetas superpuestas. Next service cambia la tarjeta activa; el detalle permanece accesible desde “View all services”.
- `/services`: List presenta los seis servicios como enlaces tipográficos y Content & Audio abrió correctamente su ficha.
- Light y System fueron comprobados visualmente. System resolvió Dark según la preferencia del navegador de prueba; Light se conservó después de recargar el detalle del servicio.
- Home y `/services` se revisaron en navegador integrado. Ningún error o warning de consola en la revisión de Gallery/List.

## Portada, Work y Services simplificados — 20 septiembre 2026
- `pnpm check`: PASS tras las modificaciones.
- Producción local en `http://127.0.0.1:3001/`: después de Skip/Escape, la portada sólo expone el manifiesto central y “We engineer spectacle.”; no aparecen Scroll to explore, Replay intro, Pause video, Start a project, la descripción ni la ubicación.
- Scroll de portada: `PageDown` llevó el video de `scale(1)` / `blur(0px)` a `scale(1.14)` / `blur(14px)` a 720 px de scroll.
- Home: “Selected work” no incluye `/08`, queda antes de Services y conserva tres proyectos principales con título central entre dos espacios multimedia. Más abajo “Our work.” conserva la galería de tres proyectos, omite las cinco tarjetas restantes y “View all work” no tiene flecha.
- Services: encabezado sin `/06`, sólo quedan las dos flechas y ya no existe enlace/etiqueta dinámica de “Explore service” junto a los controles. Con foco de teclado en una tarjeta, su foto pasó a `opacity .48` y `brightness(.72)` y el texto bajo la foto llegó a `opacity 1`.
- Móvil 390 × 844: sin overflow horizontal (`scrollWidth 375`, `innerWidth 390`). Consola de navegador sin warnings ni errores.

## Página Work en mosaico — 20 septiembre 2026
- `pnpm check`: PASS tras sustituir el filtro por el mosaico.
- `/work`: H1 “Our work.”, texto de introducción indicado y ocho enlaces de proyectos en una galería mosaico monocromática.
- No aparecen “Selected work / 08”, el filtro por servicio ni el contador de resultados. Revisión visual realizada en navegador integrado sin errores ni warnings de consola.

## Límites
No se ejecutó Lighthouse ni una auditoría completa WCAG, ni se probó Safari/Firefox.
La preferencia de movimiento reducido se implementó y revisó en código; el navegador de pruebas no expone emulación de esa preferencia.
El video se conserva como copia intacta (~60 MB) para esta fase temporal, según la solicitud.
Contacto sin backend de envío. Sitio local con noindex; no se publicaron recursos externos.
