# Nx boundaries

Los límites actuales se aplican con `@nx/enforce-module-boundaries` en
`eslint.config.mjs` y se describen en `docs/architecture/enforcement.md`.

## Contrato de tags

Toda biblioteca nueva declara un tag de alcance y otro de responsabilidad:

```text
scope:<bounded-context> | scope:platform | scope:shared | scope:app
type:app | type:e2e | type:shell | type:feature | type:ui |
type:application | type:domain | type:infrastructure | type:platform | type:util
```

Los bounded contexts se registran en
`tools/architecture-enforcement/business-scopes.json`. Los imports entre
contextos usan únicamente contratos públicos deliberados; una API pública no
convierte automáticamente una dependencia entre scopes en válida. No se añaden
librerías sin tags ni excepciones amplias para resolver una dependencia.

## Shells de dominio

La aplicación sólo compone un bounded context a través de `type:shell`. Una
shell puede cargar las `type:feature` de su propio contexto; una feature no puede
importar ni cargar otra feature o shell. Esto incluye `import()` usado en rutas:
la carga perezosa no elimina la dependencia arquitectónica.

## Cambiar la matriz

1. Identificar el contrato que justifica la nueva dependencia.
2. Actualizar a la vez `docs/architecture/enforcement.md` y la política de
   `tools/architecture-enforcement/` consumida por `eslint.config.mjs`.
3. Ejecutar `npx nx check architecture-enforcement`, sus tests y el lint de los
   proyectos implicados.
