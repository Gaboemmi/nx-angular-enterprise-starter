# OpenAPI Contract

## Purpose

OpenAPI is the versioned contract between frontend and backend. It describes
transport APIs; it is not a domain model and does not define feature ownership.

## Ownership and lifecycle

The backend owns the API specification. The frontend version-controls the input
or an immutable fetched version used for generation, plus generator settings.
Generated clients, DTOs and supporting code live at the infrastructure boundary
and are never edited manually.

```text
OpenAPI specification
        -> deterministic generation
        -> generated infrastructure client/DTOs
        -> mapper or repository
        -> application/domain contract
```

Generation must be reproducible in local development and CI. A changed contract
triggers regeneration, type checking, linting and compatibility validation
before consumers are updated.

## Design rules

- A DTO does not become a domain entity just because their shapes currently
  match.
- Map at the boundary when it protects domain language, temporal semantics or
  provider independence; do not introduce identity mappers without a reason.
- Generated client APIs are private to infrastructure. Features consume
  application contracts, repositories or facades.
- Breaking contract changes are explicit and coordinated; client generation is
  not a substitute for API versioning policy.

## Errors and security

HTTP transport errors are normalized by the platform error model described in
`http-and-errors.md`. Generated clients never contain credentials or
provider-specific authentication logic.

## Testing

Validate generated code in CI and test mappings at the boundary. Contract tests
focus on compatibility and expected payload semantics; feature tests use ports
or deterministic repository doubles rather than generated clients directly.
