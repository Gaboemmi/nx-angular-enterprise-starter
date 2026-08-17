# Generadores locales

Este directorio alberga los generadores locales que codifican las convenciones
arquitectónicas del repositorio. Cada generador conserva su implementación,
esquema y plantillas dentro de su propia carpeta.

- `feature`: crea los límites iniciales de una funcionalidad.
- `use-case`: crea una operación de la capa de aplicación.
- `mapper`: crea una transformación significativa entre representaciones.
- `datasource`: crea una integración con un sistema externo.
- `shell`: crea el límite de composición y rutas de un bounded context.

El generador `shell` está disponible mediante la colección local:

```bash
npx nx g ./tools/generators/collection.json:shell --name=orders --no-interactive
```

Genera `libs/domains/orders/shell`, con el tag `scope:domain,type:shell` y una
API pública de rutas. Las rutas de la aplicación se actualizan de forma
explícita después de generar la shell, para que la app sólo dependa de ese
contrato y no conozca las features del dominio.

Los demás directorios siguen siendo reservas documentales; no exponen todavía
generadores ejecutables.
