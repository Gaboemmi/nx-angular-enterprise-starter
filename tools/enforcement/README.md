# Enforcement local

Este directorio reúne los artefactos que convierten las decisiones de
arquitectura en comprobaciones repetibles. La documentación de la política vive
en `docs/architecture/enforcement.md`; aquí vive la configuración, las pruebas
arquitectónicas y la automatización que la hacen ejecutable.

| Área             | Responsabilidad                                                       | Estado inicial                         |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------- |
| `eslint/`        | Reglas estáticas y límites de importación.                            | Activo mediante la configuración raíz. |
| `sheriff/`       | Restricciones de arquitectura más expresivas, si Nx/ESLint no bastan. | Preparado; no instalado.               |
| `nx-boundaries/` | Tags y matriz de dependencias de proyectos Nx.                        | Activo mediante ESLint.                |
| `tests/`         | Pruebas de comportamiento y de reglas no expresables por lint.        | Activo en `architecture-enforcement`.  |
| `ci/`            | Composición de las verificaciones en automatización.                  | Plantilla opcional; desactivada.       |

La política ejecutable, el registro de bounded contexts y sus tests viven en
`tools/architecture-enforcement/`. Este directorio mantiene el mapa operativo y
las notas de cada mecanismo.

No se duplica una regla entre áreas. Elegir la capa más simple que pueda
detectar el incumplimiento de manera fiable: tipos, ESLint/Nx, prueba o CI.

## Cambiar una regla

1. Actualizar primero la política en `docs/architecture/enforcement.md`.
2. Ajustar la configuración o la prueba propietaria de la regla.
3. Añadir una prueba de regresión cuando la regla no pueda expresarse de forma
   fiable en la configuración.
4. Ejecutar la comprobación local y revisar que la CI aplique el mismo nivel de
   calidad.
