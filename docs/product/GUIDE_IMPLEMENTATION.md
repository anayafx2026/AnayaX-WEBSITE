# Guía de ANAYAFX: revisión local del 30 de septiembre de 2026

Fuente editorial: `C:/Users/anton/Downloads/ANAYAFX-Guia-Sitio-Web-Tono.pdf`, fechada el 29 de septiembre de 2026. Sustituye el mapa y los pendientes anteriores. Los textos ingleses suministrados se conservan literalmente. La instrucción del usuario de recuperar el logo antiguo determina el recurso de marca.

## Implementado en la primera revisión (ajustado por la aclaración al final)

- Logo original de OLD landing en cabecera, intro y footer; favicon e imagen social del sitio antiguo.
- ANAYAFX en texto y metadatos, Anaya Visual, Inc. solo en copyright; sin rayas largas.
- Home, Work, Services, Rentals, Studio, About y Contact en ese orden; FAQs en footer. El PDF dice seis áreas pero enumera siete enlaces contando Home: se conserva su lista completa.
- Doce proyectos en el orden solicitado y cuatro filtros; Notable credits sin Metallica. Sin Private Commission.
- Rentals sin tarifas; Studio dentro de The Core; About y diez FAQs con el texto de la guía.
- Seis servicios con nombres y URLs corregidos, enlaces a proyectos relacionados según los roles descritos. No se atribuye un servicio a Kenny Chesney hasta confirmar el rol.
- Redirecciones de Coachella, Sphere, spacial y /faq.
- Contacto comienza con Project, Rental o Studio; los botones de Rentals y Studio preseleccionan la opción. Validación y revisión antes de abrir un borrador a studio@anayafx.com.
- Intro de 2.5 segundos, una vez por sesión, salto por clic, scroll o Escape; movimiento reducido y control de pausa. H1 visible sin JavaScript.
- Video local convertido a MP4 H.264 (13.35 MB) y WebM (12.55 MB), sin audio, a 1280 px de ancho y 30 fps; póster JPEG de 41 KB. Son derivados del MOV de 60.29 MB disponible, no del nuevo master pendiente.
- Selector de tema retirado; menú sólido; una sola galería de servicios y un solo título. Tarjetas tipográficas cuando no hay una foto identificada.
- Teléfono y enlaces genéricos a redes retirados. La franja de colaboradores usa los PNG proporcionados para Netflix, Eagles, Kenny Chesney y Lenovo, además de los logos existentes, sin cambiar el orden ni los contenedores de la animación.
- Fotos locales identificadas: Eagles Tour, Andrea Bocelli, Jimmy Kimmel Live y XR Stage. No se usa la foto de Coachella 2023 para describir 2024/2025 ni se atribuyen las fotos antiguas de Ford al lanzamiento F-150 sin confirmación.

## Bloqueos de lanzamiento: no dar por completados

- Nuevo master del demo reel y media aprobada de los doce proyectos. Las doce fichas están disponibles para revisión local; antes de publicar, los proyectos que continúen sin media deben pasar a Notable credits, sin ficha propia, conforme a la guía.
- Las superficies tipográficas sustituyen los recuadros FOTO/VIDEO pero no cumplen el pendiente de recibir media real. Falta media de Sphere (cuatro proyectos), Chick-fil-A, Ford F-150, Coachella 2024/2025, Windows 11, Studio y Contact, y las imágenes definitivas del carrusel.
- Video demo y fotos del Studio. No usar imágenes de XR Stage como si fueran The Core.
- Confirmación por Simón del rol de Kenny Chesney, texto de Eagles Tour, todos los borradores y FAQs, y canales sociales.
- Prueba real de recepción del correo. El formulario sigue abriendo un borrador; no hay backend de envío. Las pruebas locales verifican destinatario, asunto y cuerpo sin enviar mensajes.
- Privacy aparece en el diagrama, pero no se proporcionó política ni ruta aprobada. No inventar texto legal ni crear un enlace sin destino.
- Revisión real de tarjetas al compartir en iMessage, Slack y LinkedIn; la imagen OG es la original disponible, pendiente de aprobación final.
- Rendimiento con media definitiva, cambio de dominio y despliegue en Vercel pendientes. No se ha publicado ni cambiado DNS; noindex permanece activo.

## Validación de la primera revisión (antes de recuperar diseño y animaciones)

- `pnpm check` completo con Node 22.23.3: documentación, lint sin advertencias, tipos, nueve pruebas unitarias, build y smoke correctos. Smoke comprueba 26 rutas, canonical, encabezados, noindex, assets, redirecciones y 404.
- La ruta de disponibilidad se corrigió de estática a dinámica: ahora responde 503 si el backend es obligatorio y no está configurado, en lugar de reutilizar un 200 calculado en build.
- Chromium: escritorio a 1440 px y móvil a 390 px. Sin desbordamiento horizontal en Home, Work, Services, Rentals, Studio, About, Contact, FAQs y una ficha con foto.
- Intro automática y omisión por clic, rueda y Escape; no se repite en la sesión. Movimiento reducido omite intro y deja el video detenido. Reproducción real del showreel comprobada.
- Los filtros muestran 4, 2, 3 y 3 proyectos; All muestra 12. Contacto valida campos requeridos, conserva el brief al retroceder y prepara destinatario, asunto y cuerpo para Project, Rental y Studio. No se envió correo.
- Menú móvil con todos los enlaces y devolución de foco tras Escape. Imágenes renderizadas con atributo alt. Capturas y reporte de navegador en `tmp/`, excluido de Git.
- Instalación de dependencias sin modificar el lockfile; Node 22 y FFmpeg usados desde `tmp/`. La exportación compilada antigua `ftp_new anayafx/` se excluyó del lint, igual que los temporales.
- No se ha validado recepción de correo, tarjetas en aplicaciones externas, rendimiento con media definitiva ni lanzamiento.

## Aclaración del usuario: conservar diseño y animaciones

La última instrucción prevalece sobre la interpretación inicial de la guía: mantener el orden, composición y animaciones existentes; cambiar la información y el logo. Los doce trabajos se incorporan en la galería inferior de Home y en Services.

Home mantiene: intro/hero, manifiesto, tres filas destacadas (Coachella, Sphere, XR Stage), carrusel 3D en escritorio y tarjetas superpuestas en móvil, capacidades, galería elástica inferior, clientes y resumen del estudio. No se añade una sección nueva de Sphere ni una sección de accesos que cambie este orden. Rentals y Studio se enlazan desde el resumen existente.

La intro recupera su coreografía y duración anteriores: entrada desde abajo, letras laterales, FX, recogida y desplazamiento hacia la cabecera; las máscaras se adaptan al logo original sin deformarlo. El video recupera escala y desenfoque con scroll. Se conservan video MP4/WebM, almacenamiento de sesión tolerante a fallos y movimiento reducido. La duración anterior sustituye el ajuste de 2.5 segundos del primer intento.

Services conserva su lista tipográfica y efectos, con la galería de doce proyectos debajo. Home conserva el comportamiento elástico/hover y acordeón móvil con los doce trabajos. About recupera sus bloques y espacios multimedia, integrando la información nueva. Work recupera el mosaico y efectos anteriores, extendido a doce elementos con los filtros de la guía.

Los espacios de media existentes se conservan mientras llega el material aprobado; los rótulos se traducen al inglés. Se retiró el rediseño de tarjetas numeradas y se conservan las animaciones originales.

## Revisión de la corrección, 2 de octubre de 2026

Comprobado en Chromium: orden original de secciones y destacados, secuencia del logo antiguo, rotación del carrusel 3D con rueda, galería elástica de doce proyectos en Home y Services, acordeón móvil y filtros. Sin desbordamiento horizontal a 390 px en Home, Services, About y Work. Se recuperó el marcador multimedia original para los proyectos sin foto, evitando títulos duplicados en los paneles estrechos.

Las 26 rutas, sus canonical, redirecciones, assets, noindex, 404 y disponibilidad del backend pasan el smoke. No se publicó el sitio; la vista previa se sirve en http://127.0.0.1:3100/.

Validación final: `pnpm check` completo correcto. Prueba táctil con viewport de 390 px: el primer toque expande el panel y el segundo abre la ficha. El foco de un toque ya no activa anticipadamente el panel; hover y foco visible de teclado conservan la expansión original. Revisión de capturas de intro, carrusel 3D y galerías en escritorio y móvil completada.
