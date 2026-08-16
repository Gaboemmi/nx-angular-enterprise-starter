# Create datasource

## Use when

Adding an adapter that communicates with REST, GraphQL, browser storage, IndexedDB, or an external SDK.

## Steps

1. Confirm that this code belongs to the owning feature or platform infrastructure boundary, not domain or presentation.
2. Keep transport mechanics here: URLs, methods, parameters, headers, DTOs, serialization, and provider-specific behavior.
3. Consume the platform HTTP and authentication facilities; do not create feature-specific interceptors or attach provider tokens manually.
4. Return transport representations only to infrastructure collaborators such as a repository or mapper. Do not expose generated clients or DTOs as domain entities.
5. Normalize failures through the project error model; do not surface sensitive server details to users.
6. Prefer the versioned OpenAPI contract and generated client when it exists. Never edit generated output manually.

## Validate

1. Check `docs/architecture/openapi.md` and `http-and-errors.md` for the chosen integration boundary.
2. Test request construction and success/error mapping with a deterministic HTTP or provider double.
3. Run the affected Nx lint and test targets; check that presentation code cannot import the datasource.
