# ADR-003 — Federation-Ready, Not Federation-First

**Status:** Accepted  
**Date:** 2026-08

## Context

Micro frontends can enable organizational independence but add runtime dependency, routing, observability, compatibility, deployment, and local-development complexity.

## Decision

Start as a **modular Nx monolith** and keep features/domains isolated enough for selected parts to become federated remotes later. Module Federation is a deployment capability, not a foundational dependency; business features must not depend conceptually on federation APIs.

## Consequences

- Lower initial complexity without sacrificing modularity or portability.
- Federation remains available when organizational or deployment needs justify it.
- Boundaries must be maintained proactively; later extraction still has a cost.

## Related documentation

- `docs/architecture/federation.md`
- `ADR-001-nx-monorepo.md`
- `ADR-002-domain-driven-architecture.md`
