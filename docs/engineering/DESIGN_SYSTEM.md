# Sistema de diseño Anaya FX
Tokens en src/app/globals.css. Fondo #0a0a0a, texto #ededed, secundarios #a1a1a1. Mori local con font-display swap.
Marca: BrandLogo reutiliza los PNG suministrados. Símbolo 56 px en desktop, 46 px en móvil; logotipo completo en menú y footer.
Componentes compartidos: MediaPlaceholder (blanco, rótulo y descripción), ProjectCard, ServiceGallery, ServiceList, ThemeSelector, ClientStrip, ContactForm y FaqList.
ServiceGallery adapta la composición Gallery de la referencia: tarjetas de servicios superpuestas y seleccionables mediante click, flechas, teclado y gesto. ServiceList adapta la vista List: enlaces tipográficos de gran formato que llevan a cada detalle de servicio.
SiteExperience contiene ThemeContext: Light, Dark y System. El valor escogido se guarda en localStorage bajo anaya-fx-theme; System escucha prefers-color-scheme. La ausencia o bloqueo de storage mantiene la preferencia durante la sesión.
IntroHero es Client Component: Web Animations API con secuencia de promises y cancelación al desmontar u omitir. Video liberado al entrar a fase dock. Navegación/lectura siguen siendo Server Components.
Controles accesibles y responsivos; enlaces y botones con foco visible. Movimiento reducido y pausa de animaciones/video soportados.
