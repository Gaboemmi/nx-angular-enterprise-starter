# ADR-008 — Instants in UTC, Local Time at the Boundaries

**Status:** Accepted  
**Date:** 2026-08

## Context

Manual timezone shifts and assumptions that a tenant has one timezone produce ambiguous timestamps and fragile calendar behavior.

## Decision

Store and exchange absolute moments as UTC instants (for example, `2026-08-11T18:30:00Z`). Convert only at presentation boundaries. Interpret user-entered local date/time with an explicit timezone before converting. Never use arbitrary hour offsets or universal tenant-timezone assumptions. Keep `Instant`, `LocalDate`, `LocalTime`, `LocalDateTime`, and `TimeZone` semantically distinct.

## Consequences

- Predictable global behavior and unambiguous APIs.
- Developers must understand temporal concepts; business cases may still require a stored timezone.

## Related documentation

- `docs/architecture/datetime.md`
