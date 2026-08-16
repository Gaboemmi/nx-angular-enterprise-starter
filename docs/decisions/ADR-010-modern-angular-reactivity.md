# ADR-010 — Delegate Angular conventions to Angular

**Status:** Accepted  
**Date:** 2026-08

## Context

The starter should follow current Angular direction without copying framework
guidance into repository-owned documentation. Framework conventions evolve more
quickly than this architecture and are maintained by the Angular team.

## Decision

Use the official Angular `angular-developer` Agent Skill for Angular code,
including component APIs, reactivity, dependency injection, templates, routing,
accessibility, testing, and CLI guidance. The Harness must not restate those
rules.

Repository documentation may define architecture that Angular cannot infer, such
as state ownership, dependency direction, domain boundaries, and contracts.

## Consequences

- Angular practices stay current through their upstream source.
- Repository guidance remains smaller and is limited to repository decisions.
- Agents must have the Angular skill available when making Angular changes.

## Related documentation

- `.ai/README.md`
- `docs/architecture/state-management.md`
