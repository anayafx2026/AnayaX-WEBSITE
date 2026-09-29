# Configuración y entornos

| Variable | Tipo / momento | Uso |
|---|---|---|
| SITE_URL | Público, build | Dominio canónico final HTTPS en Production |
| SITE_INDEXABLE | Build, default false | Opt-in para indexar solo Production |
| VERCEL_ENV | Sistema Vercel | Development, Preview o Production; no sobrescribir |
| NEXT_PUBLIC_SUPABASE_URL | Público, build | URL del proyecto Supabase del entorno |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Público, build | Clave pública; RLS sigue siendo obligatoria |
| SUPABASE_REQUIRED | Servidor, runtime | Readiness requiere Auth y REST si es true |
| SUPABASE_SECRET_KEY | Secreto, runtime, opcional | Funciones administrativas autorizadas |

Local: .env.local ignorado por Git. Vercel: valores separados por entorno.
No conectar previews a producción. Un dominio de preview no reemplaza el canonical
final; SITE_URL expresa la identidad del sitio. En producción se rechaza HTTP,
localhost y dominios de ejemplo. Para revisar por primera vez, usar Preview.

Cambiar SITE_URL, SITE_INDEXABLE o NEXT_PUBLIC requiere nuevo build/deploy.
En Vercel, aplicar cambios de variables mediante un nuevo despliegue.
Usar valores literales sin interpolación entre variables en archivos .env.
Los scripts de validación aplican prioridad: environment exportado >
.env.production.local > .env.local > .env.production > .env.

No fijar NODE_ENV manualmente: el comando de Next selecciona su modo.
No compartir .env ni subirlo al repositorio. Documentar nuevas variables en el
schema, .env.example, esta tabla y el procedimiento de publicación.

Referencias: https://vercel.com/docs/environment-variables
y https://vercel.com/docs/deployments/environments
