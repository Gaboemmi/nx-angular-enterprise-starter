# ADR-007 — Runtime Translation with Tolgee

**Status:** Accepted  
**Date:** 2026-08

## Context

Enterprise translation needs collaboration, review, synchronization, dynamic language changes, and locale variants beyond static JSON files. Language and locale are related but different concerns.

## Decision

Use runtime translations with **Tolgee** as the source of truth for the
translation-management workflow. Translation keys and synchronized catalogs
remain versioned repository artifacts, so the application contract is never
owned exclusively by an external platform. Keys are stable semantic identifiers
(for example, `operations.incidents.status.resolved`), not English text. Model
language, locale, translation, and formatting separately; use BCP 47-style
variants such as `en-GB` and explicit fallback such as `en-GB → en`.

## Consequences

- Runtime switching, external collaboration, and reliable locale variants.
- Translation infrastructure, synchronization, and key governance become required.

## Related documentation

- `docs/architecture/i18n-l10n.md`
