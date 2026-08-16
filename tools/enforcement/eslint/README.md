# ESLint

La configuración raíz `eslint.config.mjs` es la fuente de verdad para las
reglas de ESLint. Nx la carga para cada proyecto mediante el target `lint`.

## Base actual

- `@eslint/js` recommended.
- `typescript-eslint` `strictTypeChecked` y `stylisticTypeChecked`, con
  `projectService` para las reglas que requieren información de tipos.
- `angular-eslint` `tsRecommended`, `templateRecommended` y
  `templateAccessibility`.
- Configuraciones flat de Nx para la integración del workspace.
- `@nx/enforce-module-boundaries` para los límites entre proyectos.
- Exclusión de artefactos generados de compilación (`dist` y `out-tsc`).

Las configuraciones Angular de templates se aplican únicamente a `*.html`; las
reglas TypeScript tipadas se limitan a ficheros TypeScript. No activar las
configuraciones `*-all`: no constituyen un baseline estable para aplicaciones.
`no-extraneous-class` se desactiva porque una clase Angular decorada puede no
tener miembros y aun así definir comportamiento en sus metadatos.

## Añadir una regla

1. Preferir una regla existente de TypeScript, Angular o ESLint antes de crear
   una regla local.
2. Limitarla a los tipos de archivo y proyectos donde la semántica sea válida.
3. Incluir una prueba o fixture cuando la regla codifique arquitectura no
   obvia.
4. Ejecutar `npx nx lint <project>` sobre un proyecto afectado.

No usar ESLint para duplicar restricciones que TypeScript o Nx ya verifican de
forma suficiente.
