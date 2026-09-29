# Seguridad, formularios y datos

## Autenticación y autorización

Los clientes SSR están preparados, pero no hay login ni rutas privadas funcionales.
El proxy solo renueva sesión en /account, /admin y /auth. Añadir rutas reales al
matcher cuando se implementen. Las páginas públicas no deben consultar Auth.
Verificar identidad en servidor y autorizar cada lectura/mutación privada.
Para decisiones que necesitan estado actual de la cuenta, consultar getUser;
no interpretar una sesión del navegador como autorización.

## Supabase

Activar RLS en tablas expuestas y definir políticas por operación. Añadir constraints
e índices. Probar anónimo, propietario, usuario ajeno y administrador.
El cliente admin es server-only, opcional y necesita autorización explícita en cada
uso. No publicar secret keys ni desactivar RLS para resolver errores.

Migraciones versionadas, tipos regenerados desde la DB real y pruebas de permisos.
No ejecutar migraciones de producción durante builds de Preview. Usar entornos
de datos aislados; documentar orden de despliegue y compatibilidad de schema.

## Formularios públicos

Validación Zod en servidor; límites de tamaño y frecuencia; manejo de spam;
protección apropiada frente a peticiones no autorizadas; honeypot/captcha solo
como parte del control. Un límite en memoria no funciona de forma global en
serverless. Evitar inserciones anónimas irrestrictas y listados públicos de leads.
Registrar entrega/persistencia real antes de mostrar éxito. Retener datos mínimos.

## Uploads, webhooks e integraciones

Validar tamaño, tipo, propietario y ruta; buckets privados por defecto para datos
privados. URLs firmadas con caducidad. Verificar firma de webhooks sobre el cuerpo
original y evitar efectos duplicados con idempotencia. Timeouts y errores seguros.
No renderizar HTML externo sin sanitizar ni aceptar destinos de redirect arbitrarios.

## Cabeceras y observabilidad

La base configura nosniff, DENY para frames, Referrer-Policy y Permissions-Policy.
Diseñar CSP según scripts/orígenes reales y comprobarla antes de bloquear tráfico.
No añadir unsafe-inline indiscriminadamente ni asumir una CSP inexistente.
Logs con identificador de petición/evento y error seguro, nunca tokens, claves o
formularios completos. Revisar decisiones sobre analítica, cookies y privacidad
según necesidades reales y responsables del proyecto.

Guía SSR: https://supabase.com/docs/guides/auth/server-side/creating-a-client
