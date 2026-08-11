# ADR-005 — Provider-Agnostic Authentication

**Status:** Accepted  
**Date:** 2026-08

## Context

Identity providers vary by organization and environment. Direct coupling to Keycloak, Auth0, Azure AD, Cognito, or similar SDKs would leak vendor concepts into business features.

## Decision

Expose an application-owned auth port for normalized identity and session concepts such as `currentUser`, `isAuthenticated`, `login()`, and `logout()`. Provider SDKs live behind infrastructure adapters; token, redirect, session, and initialization handling remain provider-specific.

Authorization (application permissions) and tenant selection are separate
platform capabilities. They may use normalized identity information, but they
are not responsibilities of the authentication port.

## Consequences

- Vendor-neutral business code, limited replacement impact, and easier tests.
- Requires an adapter layer and careful extensions for provider-specific features.

## Related documentation

- `docs/architecture/authentication.md`
