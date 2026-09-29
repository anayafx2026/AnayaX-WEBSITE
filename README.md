# Anaya FX
Website de Anaya FX creado sobre fullstack_website_starter.

## Desarrollo
Node 22.x y pnpm 10.x.
```powershell
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```
Abrir http://localhost:3000. No se requieren credenciales para el sitio público; Supabase permanece opcional.

## Contenido
Inicio con introducción del logo y video, 8 proyectos en galería mosaico monocromática con fichas, 6 servicios con todas sus especialidades, estudio, contacto y FAQs.
Los textos proceden de las dos versiones anteriores del website Anaya FX. Las fotos y demás videos siguen como espacios blancos FOTO / VIDEO.

## Entrada de marca
Símbolo desde abajo → AN se desliza desde el centro a la izquierda y YA a la derecha → FX se desliza hacia fuera → las letras se recogen detrás del símbolo → símbolo hacia la cabecera. Máscaras fijas ocultan las letras durante su recorrido, sin deformarlas.
El video local comienza con el desplazamiento superior del símbolo. Duración aproximada de la secuencia: 4.8 s. La portada no incluye botón para saltar la intro, Replay ni un control de pausa/reproducción del video; la tecla Escape sigue cerrando la intro. Preferencia de movimiento reducido: sin intro y video detenido hasta una acción del visitante.
La implementación está en src/components/intro-hero.tsx y src/app/globals.css.

## Servicios y tema
Home presenta los seis servicios como una galería de tarjetas superpuestas. Al hover o foco de una tarjeta, el espacio FOTO se atenúa y aparece “Explore service”. `/services` usa una lista tipográfica de gran formato con enlaces a cada especialidad. El selector fijo Light / Dark / System conserva la elección en el navegador; System respeta la preferencia de color del dispositivo.

## Recursos
public/brand contiene los PNG originales de Identidad visual.
public/videos/anaya-showreel.mov es una copia sin modificar de IMG_0028.MOV (33.11 s, ~60 MB).
El material original en Downloads/AnayaFX permanece intacto.
El contacto prepara un borrador para studio@anayafx.com; no envía ni guarda datos automáticamente.
No se ha publicado el website. Noindex activo para la revisión local.
