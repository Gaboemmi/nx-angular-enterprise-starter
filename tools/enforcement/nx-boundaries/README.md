# Nx boundaries

Los límites actuales se aplican con `@nx/enforce-module-boundaries` en
`eslint.config.mjs` y se describen en `docs/architecture/enforcement.md`.

## Contrato de tags

Toda biblioteca nueva declara un tag de alcance y otro de responsabilidad:

```text
scope:domain | scope:platform | scope:shared | scope:app
type:domain | type:application | type:infrastructure | type:presentation |
type:ui | type:util | type:platform
```

Los imports entre dominios usan únicamente la API pública del proyecto. No se
añaden librerías sin tags ni excepciones amplias para resolver una dependencia.

## Cambiar la matriz

1. Identificar el contrato que justifica la nueva dependencia.
2. Actualizar a la vez `docs/architecture/enforcement.md` y la matriz
   `depConstraints` de `eslint.config.mjs`.
3. Ejecutar lint de los proyectos implicados y comprobar que ningún borde
   prohibido queda permitido de forma accidental.
