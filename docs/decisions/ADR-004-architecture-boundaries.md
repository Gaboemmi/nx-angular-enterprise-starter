# ADR-004 — Architecture Boundaries Are Enforced

**Status:** Accepted  
**Date:** 2026-08

## Context

Markdown-only architecture degrades through accidental imports and hidden coupling, especially with AI-assisted development.

## Decision

Machine-enforce architecture where reasonably possible through Nx project tags and dependency constraints, ESLint, architecture-specific linting, Sheriff where useful, and CI checks. Examples of forbidden dependencies include `domain → infrastructure`, `domain → Angular`, direct dependencies between bounded-context scopes, and `presentation → datasource`. Cross-context collaboration uses runtime APIs/events, application composition, or a deliberately extracted stable contract in `scope:shared`; a public entry point does not by itself permit a cross-scope import.

## Consequences

- Executable architecture and early feedback for humans and AI.
- Less repetitive structural review and a more trustworthy repository.
- Requires initial configuration and well-calibrated, evolving rules.

## Related documentation

- `docs/architecture/principles.md`
- `docs/architecture/ddd.md`
