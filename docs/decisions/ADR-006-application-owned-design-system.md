# ADR-006 — Application-Owned Design System

**Status:** Accepted  
**Date:** 2026-08

## Context

Enterprise applications require a consistent visual language, accessibility strategy, interaction model, and product/design contract. Multiple direct component-library usages create inconsistency and migration risk.

## Decision

Provide a project-owned design system at `@ae/design-system`; Angular Material is not its base component system. Prefer semantic HTML, Angular Aria for complex accessible interactions, and Angular CDK for behavioral infrastructure. Common components expose standalone, strict, OnPush, Signals-appropriate APIs and favor directives when native semantics fit, e.g. `<button aeButton>`. Publish secondary entry points rather than a global barrel. Tokens progress from primitive to semantic to component tokens.

## Consequences

- Consistent UX, accessibility, controlled library coupling, and easier redesigns.
- The design system needs sustained ownership; applications must not bypass it.

## Related documentation

- `docs/architecture/design-system.md`
