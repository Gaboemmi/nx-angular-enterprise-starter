# Generadores locales

Este directorio alberga los generadores locales que codifican las convenciones
arquitectónicas del repositorio. Cada generador conserva su implementación,
esquema y plantillas dentro de su propia carpeta.

- `feature`: crea los límites iniciales de una funcionalidad.
- `use-case`: crea una operación de la capa de aplicación.
- `mapper`: crea una transformación significativa entre representaciones.
- `datasource`: crea una integración con un sistema externo.

Los generadores se añadirán a una colección local cuando su contrato de entrada
y sus plantillas estén definidos.
