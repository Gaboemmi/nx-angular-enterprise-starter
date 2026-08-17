# ADR-015 — Provider-Agnostic Feature Flags

**Status:** Accepted  
**Date:** 2026-08

## Context

Feature-flag providers are external and replaceable. Coupling product features
to their SDK would leak provider concepts, complicate deterministic tests, and
make a vendor change unnecessarily broad.

## Decision

Expose a platform-owned `FeatureFlagService` backed by a
`FeatureFlagProvider` port. Angular consumers receive signals; structural
directives are limited to UI composition. The starter ships a static provider
and an OpenFeature adapter contract, but does not require an external provider
or SDK.

Flags are centrally catalogued with a safe default and lifecycle metadata.
Release flags have an owner and expiry date. Feature flags are never an
authorization mechanism.

## Consequences

- Features remain provider-agnostic and tests remain deterministic.
- A provider adapter is required for each chosen external platform.
- Release flags must be cleaned up at expiry with their obsolete code.

## Related documentation

- `docs/architecture/feature-flags.md`
