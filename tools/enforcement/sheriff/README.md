# Sheriff

Sheriff es una opción para restricciones arquitectónicas que no puedan
expresarse con tags de Nx y ESLint. No está instalado todavía.

## Criterio de adopción

Adoptarlo únicamente cuando exista una regla concreta, recurrente y comprobable
que las herramientas actuales no puedan implementar de forma clara. Documentar
antes:

1. la dependencia prohibida o permitida;
2. por qué `@nx/enforce-module-boundaries` no es suficiente;
3. el proyecto y los imports de ejemplo afectados;
4. la verificación de regresión y el coste de mantenimiento.

La futura configuración debe convivir con los tags Nx, no sustituirlos ni crear
una segunda taxonomía de responsabilidades.
