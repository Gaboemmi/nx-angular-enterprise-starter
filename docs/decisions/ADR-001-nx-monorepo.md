# ADR-001 — Nx Monorepo

**Status:** Accepted  
**Date:** 2026-08

## Context

The project is a reusable enterprise Angular foundation that must grow across applications, domains, shared infrastructure, libraries, tests, and tooling. It needs explicit boundaries, controlled sharing, dependency visibility, incremental work, and rules that can be enforced automatically.

## Decision

Use an **Nx monorepo**. Applications and libraries share one repository and dependency graph. Libraries represent domain and architectural boundaries, not merely technical folders. Nx tags, dependency constraints, project boundaries, and architecture tooling may enforce those boundaries.

## Consequences

- Centralized dependency graph, code sharing, incremental builds/tests, and multi-application support.
- Stronger CI validation and a natural path to future federation.
- The team must maintain sensible library granularity and learn Nx concepts.

## Related documentation

- `docs/architecture/principles.md`
- `docs/architecture/ddd.md`
- `docs/architecture/federation.md`
