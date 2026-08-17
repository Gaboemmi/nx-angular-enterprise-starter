# Feature flags

Feature flags are a provider-agnostic platform capability. Use
`@nx-angular-enterprise-starter/core/feature-flags`, not provider SDKs, from
application and feature code. Declare flags in the application catalogue with
a safe default and lifecycle metadata; release flags require an owner and an
expiry date. Feature flags are not authorization. See
`docs/decisions/ADR-015-provider-agnostic-feature-flags.md` and
`docs/architecture/feature-flags.md`.
