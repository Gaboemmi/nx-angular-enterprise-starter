# ADR-010 — Modern Angular Reactivity

**Status:** Accepted  
**Date:** 2026-08

## Context

The starter should follow current Angular direction instead of retaining historical state and change-detection patterns by default.

## Decision

Prefer Signals, standalone APIs, OnPush, and zoneless Angular where supported by the adopted Angular version and dependencies. Signals are the default for synchronous UI/application state. RxJS remains appropriate for asynchronous streams, event streams, WebSockets, and complex async composition. Avoid mutable shared component state.

## Consequences

- Explicit reactivity, lower change-detection overhead, and long-term Angular alignment.
- Teams must understand Signal/Observable boundaries; some dependencies may retain zone assumptions.

## Related documentation

- `docs/architecture/principles.md`
- `docs/architecture/design-system.md`
