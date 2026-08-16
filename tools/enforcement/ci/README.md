# CI

El workflow de GitHub Actions en `.github/workflows/ci.yml` ejecuta las puertas
de calidad base para cada cambio: lint, pruebas unitarias y compilación de los
proyectos Nx.

## Principios

- La CI ejecuta las mismas comprobaciones que se pueden ejecutar localmente.
- Un cambio de arquitectura actualiza la regla y su verificación en el mismo
  pull request.
- Las comprobaciones de e2e, contrato, seguridad o despliegue se añaden cuando
  su infraestructura y su señal de fallo estén definidas.

La evolución inicial debe preferir targets afectados de Nx cuando el tamaño del
monorepo justifique la optimización; mientras tanto, el workflow valida todos
los proyectos para mantener una puerta determinista.
