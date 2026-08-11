# ADR-009 — OpenAPI as Backend Contract

**Status:** Accepted  
**Date:** 2026-08

## Context

Handwritten frontend interfaces diverge from backend implementations. The system needs an explicit, versionable contract while keeping transport concerns out of the domain.

## Decision

Use **OpenAPI** as the primary frontend/backend contract. Generate frontend clients and transport DTOs when practical. Generated code belongs to the infrastructure boundary; DTOs never become domain entities. Map API DTOs to domain models where that boundary provides value.

## Consequences

- Explicit contracts, earlier breaking-change detection, less repeated code, and consistent API documentation.
- Generated artifacts require lifecycle management; weak API design still needs mapping.

## Related documentation

- `docs/architecture/openapi.md`
- `docs/architecture/http-and-errors.md`
- `docs/architecture/ddd.md`
