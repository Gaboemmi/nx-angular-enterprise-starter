# ESLint

La configuración raíz `eslint.config.mjs` es la fuente de verdad para las
reglas de ESLint. Nx la carga para cada proyecto mediante el target `lint`.

## Base actual

- Configuraciones flat de Nx para JavaScript y TypeScript.
- `@nx/enforce-module-boundaries` para los límites entre proyectos.
- Exclusión de artefactos generados de compilación (`dist` y `out-tsc`).

## Añadir una regla

1. Preferir una regla existente de TypeScript, Angular o ESLint antes de crear
   una regla local.
2. Limitarla a los tipos de archivo y proyectos donde la semántica sea válida.
3. Incluir una prueba o fixture cuando la regla codifique arquitectura no
   obvia.
4. Ejecutar `npx nx lint <project>` sobre un proyecto afectado.

No usar ESLint para duplicar restricciones que TypeScript o Nx ya verifican de
forma suficiente.
