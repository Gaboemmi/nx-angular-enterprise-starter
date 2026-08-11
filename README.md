# Nx Angular Enterprise Starter

Una base opinada y orientada a producción para aplicaciones Angular enterprise
con Nx. El objetivo es comenzar con un monolito modular comprensible y hacerlo
evolucionar sin perder límites de dominio, calidad ni capacidad de despliegue.

No es una demo ni un framework sobre Angular: proporciona decisiones,
convenciones y validaciones para que el camino más sencillo sea también el
arquitectónicamente correcto.

## Estado actual

El repositorio está en fase de fundación. La aplicación incluida es el punto de
arranque técnico; la arquitectura y sus límites ya están documentados y parte
de ellos se aplica automáticamente.

| Área | Estado |
| --- | --- |
| Nx, aplicación standalone, `OnPush`, zoneless y TypeScript estricto | Base implementada |
| Tags Nx y restricciones de dependencias | Base implementada |
| DDD, autenticación, i18n, fecha/hora, OpenAPI y design system | Arquitectura definida |
| Auth, i18n/Tolgee, OpenAPI, design system, observabilidad y configuración runtime | Pendiente de implementación por plataformas/librerías |

Una ADR aceptada expresa una decisión; no implica que su integración técnica ya
esté terminada. El detalle de la adopción se mantiene en
[arquitectura ejecutable](docs/architecture/enforcement.md).

## Principios

- Organizar el negocio por dominios y capacidades, no por carpetas técnicas.
- Mantener las dependencias hacia conceptos estables: dominio y aplicación no
  conocen HTTP, SDKs de proveedores ni UI.
- Empezar con un monolito modular: federation-ready, no federation-first.
- Usar Angular moderno: standalone, Signals cuando aportan valor, `OnPush` y
  compatibilidad zoneless.
- Tratar la infraestructura externa como reemplazable detrás de contratos de
  aplicación.
- Convertir las reglas importantes en validaciones, no solo en instrucciones.
- Priorizar simplicidad y añadir patrones únicamente cuando protegen una
  responsabilidad real.

## Arquitectura

Las responsabilidades de una funcionalidad de negocio se ordenan así:

```text
presentation -> application -> domain
infrastructure -> implementa contratos de domain/application
```

No todas las funcionalidades necesitan todas las capas. Una feature sencilla
puede usar estado local; una compleja puede exponer una fachada y separar casos
de uso, puertos, repositorios y mapeadores. Los detalles están en
[DDD](docs/architecture/ddd.md).

Las aplicaciones componen dominios y capacidades de plataforma. La comunicación
entre dominios ocurre por APIs públicas, contratos explícitos, rutas o eventos
cuando están justificados; nunca mediante imports de implementaciones internas.

### Límites ejecutables

Las librerías deben recibir un tag de alcance y otro de responsabilidad:

```text
scope:domain | scope:platform | scope:shared | scope:app
type:domain | type:application | type:infrastructure | type:presentation |
type:ui | type:util | type:platform
```

ESLint/Nx impide las direcciones principales no permitidas. Por ejemplo, un
dominio solo puede depender de dominio/utilidades, y presentación no puede
importar infraestructura directamente. Consulta la matriz completa en
[enforcement](docs/architecture/enforcement.md).

## Capacidades de plataforma

- [Autenticación](docs/architecture/authentication.md): identidad y sesión
  agnósticas al proveedor.
- [Autorización y tenancy](docs/architecture/authorization-and-tenancy.md):
  permisos de aplicación y tenant activo, independientes de autenticación.
- [Internacionalización y localización](docs/architecture/i18n-l10n.md): idioma,
  locale y zona horaria son conceptos separados; Tolgee es infraestructura.
- [Fecha y hora](docs/architecture/datetime.md): instantes UTC, valores locales
  con semántica explícita y zonas IANA.
- [Configuración runtime](docs/architecture/runtime-configuration.md): valores
  públicos por despliegue, validados antes del arranque.
- [OpenAPI](docs/architecture/openapi.md): contrato backend/frontend y código
  generado contenido en infraestructura.
- [HTTP y errores](docs/architecture/http-and-errors.md): transporte,
  normalización de fallos y responsabilidades de interceptores.
- [Observabilidad](docs/architecture/observability.md): contratos de telemetría,
  correlación y protección de datos.
- [Design system](docs/architecture/design-system.md): HTML semántico,
  accesibilidad, tokens y APIs UI estables.
- [Federación](docs/architecture/federation.md): futura capacidad de despliegue,
  no una dependencia de las funcionalidades.
- [Estrategia de pruebas](docs/architecture/testing-strategy.md): pruebas por
  responsabilidad, contratos y flujos críticos.

## Decisiones y documentación

La documentación está deliberadamente separada:

```text
Visión -> Arquitectura -> ADRs -> Especificaciones -> Implementación
```

- [Visión del proyecto](docs/vision.md)
- [Principios de ingeniería](docs/architecture/principles.md)
- [Documentación de arquitectura](docs/architecture/)
- [Architecture Decision Records](docs/decisions/README.md)
- [Harness para contribuidores y agentes](AGENTS.md)

Las ADRs explican el porqué de las decisiones. Las guías de arquitectura
describen la estructura y las especificaciones futuras deberán concretar cambios
implementables y criterios de aceptación.

## Desarrollo y validación

Requisitos: Node.js y las dependencias instaladas con `npm install`.

```bash
npx nx serve app
npx nx lint app
npx nx test app
npx nx build app
npx nx e2e app-e2e
```

En PowerShell con ejecución de scripts restringida, usa `npx.cmd` en lugar de
`npx`.

Para un cambio de arquitectura o configuración, ejecuta al menos lint, tests y
build del proyecto afectado, revisa los tags/dependencias Nx y actualiza la
documentación o ADR correspondiente cuando cambie una decisión duradera.

## Contribución

Antes de implementar, lee [AGENTS.md](AGENTS.md) y el mapa
[`.ai/architecture.md`](.ai/architecture.md). Mantén los cambios acotados,
evita crear un `shared` para lógica de negocio y no introduzcas SDKs de
proveedores en funcionalidades de dominio.

La arquitectura sirve a la aplicación: patrones como facades, stores, casos de
uso, repositorios y mapeadores son herramientas, no capas obligatorias.
