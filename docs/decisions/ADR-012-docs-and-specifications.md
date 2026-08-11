# ADR-012 — Documentation and Specifications Have Different Responsibilities

**Status:** Accepted  
**Date:** 2026-08

## Context

Durable architectural knowledge and current implementation instructions have different lifecycles. Mixing them makes both less useful for developers and AI-assisted engineering.

## Decision

Maintain separate layers:

```text
Vision → Architecture → ADRs → Specifications → Implementation
```

`docs/` contains durable project knowledge: vision, principles, architecture explanations, ADRs, and roadmap. `specs/` contains feature requirements, acceptance criteria, constraints, technical tasks, and migration plans. ADRs explain why; architecture docs explain structure; specifications explain the current work; code is the executable implementation.

## Consequences

- Durable architecture history and focused, independently evolving specs.
- Documentation needs maintenance and clear responsibilities to avoid duplication.
