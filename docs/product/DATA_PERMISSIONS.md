# Datos y permisos — completar si el sitio los necesita

| Entidad | Campos/restricciones | Propietario | Sensibilidad | Retención |
|---|---|---|---|---|
| [Entidad] | [PK, FK, unique, checks] | [Usuario/organización/global] | [Definir] | [Definir] |

| Recurso / operación | Anónimo | Usuario propietario | Otro usuario | Administrador |
|---|---|---|---|---|
| [Operación] | [Permiso] | [Permiso] | [Permiso] | [Permiso] |

Definir propiedad, borrado, archivos asociados, estados válidos y reglas de negocio.
La matriz debe convertirse en autorización del servidor, RLS y pruebas negativas.
Nunca guardar contraseñas en tablas del dominio ni utilizar IDs como permisos.
El tipo Database incluido está vacío y es un placeholder explícito.
