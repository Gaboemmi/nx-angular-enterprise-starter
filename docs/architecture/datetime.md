# Date and Time

## Purpose

This document defines the temporal model used by the application. It prevents
calendar values, local wall-clock values, and absolute instants from being
silently treated as the same thing.

## Temporal types

| Meaning | Example | Rule |
| --- | --- | --- |
| `Instant` | `2026-08-11T18:30:00Z` | An absolute moment; store and exchange in UTC. |
| `LocalDate` | `2026-08-11` | A calendar date with no time or timezone. |
| `LocalTime` | `09:30` | A wall-clock time with no date or timezone. |
| `LocalDateTime` | `2026-08-11T09:30` | Local wall-clock date/time; not an instant. |
| `TimeZone` | `Europe/Madrid` | An IANA timezone used to resolve or display values. |

`Date` and ISO strings are transport/runtime representations, not sufficient
domain semantics on their own.

## Rules

1. APIs exchange absolute events as UTC instants with `Z` or an explicit offset.
2. Components display an `Instant` only after the platform datetime service has
   resolved a `TimeZone`.
3. User-entered local values are combined with an explicit IANA timezone before
   converting them to an `Instant`.
4. Never implement timezone conversion by adding or subtracting hours.
5. A tenant timezone is never assumed to be the user timezone. Each use case
   must state which timezone supplies business meaning.
6. Daylight-saving gaps and overlaps are validation cases, not exceptional
   arithmetic to hide.

## Boundaries

Features express temporal intent through application/domain types. The platform
datetime capability owns parsing, formatting, timezone resolution and the
selected date-time library. The i18n/l10n capability chooses locale formatting;
it does not change the represented instant.

## Testing

Tests use an explicit timezone and fixed clock. Cover DST transitions, calendar
date preservation, serialization, and the distinction between user timezone and
business timezone.

