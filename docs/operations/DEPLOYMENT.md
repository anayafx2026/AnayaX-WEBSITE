# Publicación con Vercel y Supabase

## Preparación

1. Crear repositorio del proyecto y configurar responsables y acceso.
2. Cuando se necesite backend, crear proyectos/entornos Supabase aislados para
   pruebas y producción. Registrar región, Auth, Storage, email y límites requeridos.
3. Aplicar migraciones revisadas al entorno de prueba y generar tipos reales.
4. Importar el repositorio en Vercel como Next.js. Seleccionar Node 22 y conservar
   pnpm y comandos de vercel.json. Mantener el lockfile versionado.
5. Configurar variables por entorno según docs/engineering/ENVIRONMENTS.md.
6. Crear una Preview y comprobar UI, SEO, Auth y funciones que existan.

Una creación de proyecto remoto o publicación requiere autorización del usuario;
este documento prepara el procedimiento y no ejecuta dichas acciones.

## Auth, si se implementa

Configurar Site URL y redirects permitidos del proyecto Supabase correspondiente.
Usar destinos concretos; no permitir un patrón excesivamente amplio en producción.
Implementar callback PKCE, login/logout/recuperación y validar parámetros de retorno.
Probar cookies, expiración y acceso directo a rutas privadas en Preview.

## Production

Configurar dominio final, DNS/HTTPS, SITE_URL y proyecto Supabase de producción.
SITE_INDEXABLE permanece false hasta finalizar contenido y QA.
Activar SUPABASE_REQUIRED cuando las funciones esenciales requieren backend.
Aplicar cambios DB como release controlada con recuperación, no en cada build.
Publicar una versión identificada y comprobar el dominio público después.

## Protección y rollback

Configurar Deployment Protection para previews confidenciales según las opciones
del proyecto/plan. noindex no protege acceso. Un webhook de pruebas puede necesitar
un acceso específico controlado; no abrir todas las previews para resolverlo.
Revertir un deployment no revierte tablas ni datos: comprobar compatibilidad antes
de rollback. Mantener una vía de recuperación para cambios de schema.

Fuentes oficiales:
- https://vercel.com/docs/deployments/environments
- https://vercel.com/docs/deployment-protection
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
