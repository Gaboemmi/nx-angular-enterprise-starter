# CI

La CI está desactivada por defecto. La plantilla en
`docs/templates/github-actions-ci.yml` ejecuta las puertas de calidad base para
cada cambio cuando un consumidor la copia a `.github/workflows/ci.yml`. Cuando
el repositorio configura SonarQube Cloud, también publica la cobertura LCOV y
bloquea la integración si falla el Quality Gate de nuevo código.

## Principios

- La CI ejecuta las mismas comprobaciones que se pueden ejecutar localmente.
- Un cambio de arquitectura actualiza la regla y su verificación en el mismo
  pull request.
- SonarQube Cloud complementa las reglas de TypeScript, ESLint y Nx; no es el
  propietario de las reglas de arquitectura del repositorio.
- Las comprobaciones de e2e, contrato, seguridad o despliegue se añaden cuando
  su infraestructura y su señal de fallo estén definidas.

## Activar SonarQube Cloud

1. Importar el repositorio como un único proyecto en SonarQube Cloud y
   deshabilitar el análisis automático, ya que la cobertura se publica desde CI.
2. Crear las variables de Actions `SONAR_ORGANIZATION` y
   `SONAR_PROJECT_KEY` con los valores que muestra SonarQube Cloud.
3. Crear el secreto de Actions `SONAR_TOKEN` con un token de análisis.
4. Configurar en SonarQube Cloud el Quality Gate de nuevo código indicado en
   `docs/architecture/enforcement.md` y proteger la rama con el check del
   workflow `CI / Lint, test, build and SonarQube Cloud`.

El workflow usa un checkout completo para que SonarQube Cloud pueda calcular
correctamente New Code. El paso de análisis queda omitido hasta que existan las
dos variables; una vez existen, un token ausente o un Quality Gate fallido hace
fallar CI deliberadamente.

La evolución inicial debe preferir targets afectados de Nx cuando el tamaño del
monorepo justifique la optimización; mientras tanto, el workflow valida todos
los proyectos para mantener una puerta determinista.
