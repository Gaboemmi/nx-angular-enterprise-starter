# Add API endpoint

## Use when

Consuming a new backend operation or adapting an existing versioned API contract in a feature.

## Steps

1. Treat the backend-owned OpenAPI specification as the transport source of truth. Confirm the endpoint semantics, input, output, error cases, authentication, and idempotency.
2. Regenerate the client deterministically when generation is configured; do not manually edit generated clients or DTOs.
3. Keep generated code and transport DTOs inside infrastructure. Add a datasource, mapper, repository implementation, and application port only when each protects a real boundary.
4. Map transport failures to the application error categories and preserve cancellation, timeout, and retry policy from the platform HTTP layer.
5. Do not let components call the generated client, datasource, or endpoint directly.

## Validate

1. Validate contract compatibility and generated output using the repository's configured generation workflow when present.
2. Test request semantics, mapping, and expected error handling with deterministic doubles.
3. Run affected lint, unit tests, and build; review changed public contracts and generated files.
