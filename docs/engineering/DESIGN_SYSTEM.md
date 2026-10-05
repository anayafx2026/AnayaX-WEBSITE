# Sistema de diseño ANAYAFX

Tokens originales en src/app/globals.css, Mori local y diseño editorial oscuro. Conservar estructura, tamaños, espacios y animaciones anteriores al cambio de contenido.

BrandLogo usa el archivo original sin modificar (1920 x 321). IntroHero conserva Web Animations API, fases symbol/title/fx/compact/dock/done y los tiempos originales. Las máscaras CSS segmentan el logo antiguo, sin generar una identidad nueva. El video conserva escala/desenfoque según scroll y fuentes MP4/WebM con póster.

ServiceLoop conserva carrusel 3D por scroll/rueda en escritorio. ServiceGallery conserva tarjetas superpuestas, flechas, teclado y gesto en móvil. ServiceList conserva enlaces tipográficos y efectos de seguimiento/revelado.

FeaturedProjects fija el orden Coachella, Eagles Sphere, XR Stage, independiente del orden editorial de los doce proyectos. ElasticGallery muestra doce proyectos en Home y Services, con expansión por hover/foco y acordeón en móvil.

WorkMosaic conserva el mosaico, extendido a doce proyectos, y sus filtros. Las imágenes faltantes permanecen pendientes; no se inventan ni se atribuyen a otro evento.

Contacto mantiene las tres opciones de consulta y genera borrador de correo. No envía automáticamente. Pendientes y validación: docs/product/GUIDE_IMPLEMENTATION.md.

## Rentals y Studio en celular y tablet

Rentals conserva la secuencia cinematográfica en escritorio desde 1200 px, con altura mínima de 600 px y puntero preciso. En pantallas táctiles o ventanas más estrechas, las primeras secciones siguen el mismo orden en flujo vertical. Los productos se apilan en celular y usan dos columnas desde 600 px. Las cinco salidas VFC tienen botones con etiquetas y detalle expandible. Support gear conserva la aparición de la cámara y el zoom por scroll hacia el monitor, seguido por el zoom a la galería y el enlace de Rental, en un bloque fijo local cuyo encuadre se centra para cada pantalla. Movimiento reducido usa las secciones estáticas y seis imágenes. Cambiar la orientación conserva las variables de composición del PSD.

La descripción de Support gear se sitúa justo debajo del título. En celular y tablet, el encuadre de la cámara reserva la altura real del texto para evitar superposiciones. Título y descripción desaparecen únicamente por opacidad al comenzar el zoom hacia el monitor; al retroceder con el scroll vuelven a aparecer.

Studio mantiene el fondo PNG animado por scroll en celular y tablet. Los títulos se escalan al ancho disponible y los párrafos aparecen en intervalos separados. La preparación usa una columna en celular y dos columnas en tablet, con espacio para el menú inferior. En vistas de menos de 600 px de altura o con movimiento reducido, las escenas usan flujo vertical para que el contenido largo siga siendo accesible.

Las cinco secuencias en celular siguen el grupo CELULAR SECUENCIAS del PSD (597 × 1049 px). La 1 mezcla Your y starts delante del robot con next shot y here. detrás. La 2 sitúa el párrafo de The Core arriba del robot. La 3 conserva el título en dos líneas y los párrafos en columnas estrechas a sus lados, con fuente mínima de 14 px para que sigan siendo legibles en teléfonos pequeños. En la 4, Give your / vision queda detrás del robot y movement. delante. La 5 apila The next / shot / could be / yours., con shot rojo. El encuadre interpola las mismas imágenes PNG entre las cinco composiciones y reserva espacio para el menú inferior; tablet y escritorio conservan sus composiciones actuales.
