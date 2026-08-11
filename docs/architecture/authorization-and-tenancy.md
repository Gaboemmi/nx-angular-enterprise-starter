# Authorization and Tenancy

## Separation of concerns

Authentication answers who has a session. Authorization answers which
application permissions the current context has. Tenant context answers which
organization or workspace is active. These are independent platform
capabilities.

```text
AuthFacade -> authenticated identity
TenantContext -> current tenant
Authorization -> application permissions for identity + tenant
```

Provider roles, groups and claims are mapped by infrastructure into stable,
application-owned permissions such as `trip.update`. Business features must not
inspect provider-specific claims.

## Enforcement

Route guards and UI visibility may use authorization to improve the experience.
They are not security boundaries: backend services remain responsible for every
security-sensitive authorization decision.

Tenant selection is explicit. A feature must not infer a tenant from an access
token or URL without going through `TenantContext`. Changing tenant invalidates
tenant-scoped state and requires permission resolution to be refreshed.

## Testing

Provide deterministic test doubles for identity, tenant and permissions. Tests
must model permitted and denied outcomes without a real identity provider.

