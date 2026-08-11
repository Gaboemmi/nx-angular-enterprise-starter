# ADR-011 — Features Expose Facades, Not Internal Architecture

**Status:** Accepted  
**Date:** 2026-08

## Context

Presentation code can otherwise become coupled to use cases, stores, repositories, and other internal feature details, making refactors expensive.

## Decision

Complex features may expose a `FeatureFacade` as their presentation-facing API:

```text
Component → FeatureFacade → Use Cases / Store → Repositories
```

Facades are optional and introduced only when they establish a useful stable boundary. Components must not access datasources or infrastructure repositories directly, and internal use cases/stores are not automatically public APIs.

## Consequences

- Smaller public APIs, simpler components, and independently evolvable feature internals.
- Pass-through facades and oversized service objects must be avoided.

## Related documentation

- `docs/architecture/ddd.md`
