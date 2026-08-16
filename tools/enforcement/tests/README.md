# Tests

Las pruebas complementan el análisis estático: protegen comportamiento y reglas
que no se pueden inferir solo de imports o tipos.

## Base

- Dominio: invariantes y reglas sin Angular.
- Aplicación: resultados y orquestación con puertos deterministas.
- Infraestructura: mapeos y contratos de integración.
- Presentación: comportamiento observable, accesibilidad y transiciones de
  estado.
- E2E y contrato: recorridos críticos y compatibilidad de OpenAPI cuando estén
  en alcance.

Usar el target del proyecto afectado, por ejemplo `npx nx test app` o
`npx nx test core-ddd`. Mantener proveedores externos sustituidos por dobles
deterministas. No imponer una cuota de cobertura sin una decisión explícita.

Añadir una prueba de arquitectura cuando una regla importante no sea
representable de manera fiable por TypeScript, ESLint o Nx.
