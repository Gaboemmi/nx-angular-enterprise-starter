# ADR-002 — Domain-Driven Modular Architecture

**Status:** Accepted  
**Date:** 2026-08

## Context

Large Angular applications degrade when business rules, HTTP, UI state, components, and backend DTOs are coupled. The system needs explicit business boundaries, testability, and predictable conventions.

## Decision

Business features follow a pragmatic DDD-inspired architecture with the
following **responsibility order**:

```text
domain → application → infrastructure → presentation
```

This order does **not** express dependency direction. Dependencies point inward:
presentation depends on application/domain contracts, while infrastructure
implements domain or application contracts. The domain is independent from
Angular, HTTP, persistence, UI libraries, and DTOs.

Use `UseCase`, `Repository`, `Datasource`, `Mapper`, `Store`, and `Facade` only when they protect a meaningful responsibility. Application coordinates domain behavior; infrastructure handles external concerns; presentation uses application APIs. Strict layering applies to business features; technical infrastructure can be simpler.

## Consequences

- Isolated business logic, replaceable frameworks, DTO containment, and easier tests.
- More files and architectural judgment; patterns must not become ceremony.

## Related documentation

- `docs/architecture/ddd.md`
- `docs/architecture/core.md`
- `docs/architecture/state-management.md`
- `docs/architecture/principles.md`
