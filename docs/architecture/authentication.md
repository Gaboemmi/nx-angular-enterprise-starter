# Authentication

## Purpose

Authentication is a **platform capability** of the application and must remain independent from any specific identity provider.

The application must not depend directly on Keycloak, Auth0, Microsoft Entra ID, Cognito, or any other authentication vendor.

Instead, authentication is exposed through a small internal contract implemented by replaceable infrastructure adapters.

> Application code depends on our authentication contract. Identity providers are implementation details.

---

## Goals

The authentication architecture must:

- Be provider-agnostic.
- Allow authentication providers to be replaced without changing business features.
- Provide a simple Angular API for consuming authentication state.
- Prevent provider-specific SDKs from leaking into application features.
- Support modern authentication standards such as OAuth 2.0 and OpenID Connect (OIDC).
- Support alternative authentication strategies when required, such as BFF-based authentication.
- Be easy to mock in tests and local development.
- Keep authentication and authorization conceptually separated.
- Avoid unnecessary architectural layers and abstractions.

---

## Architecture

Authentication follows a lightweight **Ports and Adapters** approach.

```text
Application / Features
        │
        ▼
    AuthFacade
        │
        ▼
   AuthProvider
     (port)
        │
        ▼
  Auth Adapter
        │
        ├── OIDC
        ├── BFF
        ├── Custom
        └── Mock
```

`AuthProvider` represents the internal authentication contract.

Adapters integrate external authentication mechanisms with this contract.

Business features must never depend directly on those adapters or their underlying SDKs.

---

## Core Authentication Contract

The authentication core exposes application-level concepts such as:

```text
AuthProvider
AuthFacade
AuthState
AuthUser
```

A simplified provider contract could look like:

```ts
export interface AuthProvider {
  readonly state: Signal<AuthState>;

  initialize(): Promise<void>;

  login(options?: LoginOptions): Promise<void>;

  logout(): Promise<void>;

  getAccessToken(): Promise<string | null>;
}
```

This is a conceptual contract. Its exact API may evolve as implementation requirements become clearer.

The important architectural constraint is that consumers depend on this contract rather than a concrete authentication technology.

---

## Authentication State

Authentication state must be represented using application-owned models.

For example:

```ts
export interface AuthState {
  readonly status: 'initializing' | 'authenticated' | 'unauthenticated';

  readonly user: AuthUser | null;
}
```

Provider-specific concepts must be normalized before reaching application code.

---

## Application User

The application owns its representation of an authenticated user.

For example:

```ts
export interface AuthUser {
  readonly id: string;
  readonly username?: string;
  readonly email?: string;
  readonly displayName?: string;
}
```

External claims such as:

```text
preferred_username
realm_access
resource_access
groups
roles
```

must not become part of the application's authentication model simply because a particular provider exposes them.

The adapter is responsible for translating provider-specific claims into application concepts.

---

## Auth Facade

Angular consumers should interact with authentication primarily through an `AuthFacade`.

Conceptually:

```ts
@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  readonly state: Signal<AuthState>;
  readonly user: Signal<AuthUser | null>;
  readonly isAuthenticated: Signal<boolean>;

  login(): Promise<void>;
  logout(): Promise<void>;
}
```

This provides a stable and Angular-friendly API while keeping infrastructure concerns hidden.

Components should be able to use authentication without knowing how authentication is implemented.

```ts
const auth = inject(AuthFacade);

auth.user();
auth.isAuthenticated();
auth.login();
```

---

## Provider Configuration

Authentication providers are configured at application bootstrap through Angular dependency injection.

Conceptually:

```ts
provideAuth(
  provideOidcAuth({
    authority: '...',
    clientId: '...',
  }),
);
```

Another application could instead configure:

```ts
provideAuth(
  provideBffAuth({
    baseUrl: '...',
  }),
);
```

without requiring changes to business features.

The exact provider configuration API is an implementation detail and may evolve.

---

## OIDC as the Default Integration Strategy

The starter should prefer standards over vendor-specific integrations.

OAuth 2.0 and OpenID Connect allow a single adapter to work with many identity providers.

Conceptually:

```text
                     AuthProvider
                          │
                          ▼
                    OIDC Adapter
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
          Keycloak      Auth0       Entra ID
```

Therefore, the project should not create provider-specific adapters such as `KeycloakAdapter`, `Auth0Adapter`, or `EntraAdapter` unless provider-specific behavior creates a real requirement for them.

A generic OIDC implementation should be preferred whenever possible.

The underlying OIDC library remains an infrastructure detail behind the adapter.

---

## Authentication vs Authorization

Authentication and authorization are related but different concerns.

```text
Authentication
"Who are you?"

Authorization
"What are you allowed to do?"
```

Authentication must not become responsible for application authorization rules.

Provider roles or claims should not leak directly into business features.

Avoid:

```ts
user.roles.includes('KEYCLOAK_TRIP_MANAGER');
```

Prefer application-level authorization concepts:

```ts
authorization.can('trip.update');
```

This allows external roles, groups, scopes, or claims to be mapped into stable application permissions.

Authorization architecture is defined separately from the authentication provider.

---

## Tenant Context

Authentication and tenancy must also remain separate concepts.

An authenticated user does not necessarily imply a tenant.

Conceptually:

```text
Authentication
      │
      ▼
    User

Tenant Context
      │
      ▼
 Current Tenant

Authorization
      │
      ▼
 Permissions
```

This separation allows applications to support scenarios such as:

```text
Login
  ↓
Authenticated User
  ↓
Load available tenants
  ↓
Select tenant
  ↓
Establish tenant context
  ↓
Resolve permissions
```

without coupling the authentication provider to the application's tenancy model.

---

## Guards

Route guards may depend on the authentication abstraction.

For example:

```text
Route
  ↓
Auth Guard
  ↓
AuthFacade / AuthProvider
```

Guards must not depend directly on provider SDKs.

Provider-specific route guards should not be used by business features.

---

## HTTP Authentication

HTTP authentication infrastructure may obtain credentials through the authentication contract.

Conceptually:

```text
HTTP Request
     │
     ▼
Auth Interceptor
     │
     ▼
AuthProvider
     │
     ▼
Access Token
```

However, not every authentication strategy necessarily exposes tokens to the Angular application.

For example, a BFF architecture may rely on secure HTTP-only cookies instead.

Therefore, HTTP authentication behavior belongs to the configured authentication strategy and must not assume that every provider works through bearer tokens.

---

## Testing

Authentication must be easy to replace during tests.

A mock adapter should allow tests to represent states such as:

```text
unauthenticated
authenticated
authenticated as user X
```

without initializing a real identity provider.

Business feature tests must not require Keycloak, Auth0, OIDC servers, or other external authentication infrastructure.

---

## Architectural Boundaries

Business features must depend only on application-owned authentication APIs.

Allowed:

```text
feature → AuthFacade
feature → AuthUser
feature → AuthState
```

Not allowed:

```text
feature → Keycloak SDK
feature → Auth0 SDK
feature → MSAL
feature → OIDC client library
feature → concrete authentication adapter
```

Provider dependencies belong exclusively inside authentication infrastructure.

These boundaries should be enforced for business features where practical through Nx or architectural tooling.

---

## Pragmatic Architecture

Authentication is part of the platform/core layer and does not need to reproduce the complete architecture used by business features.

We should not introduce abstractions only for architectural symmetry.

For example, authentication does not automatically require:

```text
LoginUseCase
LogoutUseCase
GetCurrentUserUseCase
RefreshTokenUseCase
AuthRepository
AuthDatasource
```

unless those abstractions solve an actual problem.

The `AuthProvider` abstraction exists because authentication mechanisms are intentionally replaceable.

> No abstraction for symmetry. Abstractions must earn their existence.

---

## Initial Scope

The initial implementation should remain intentionally small.

The first version should provide:

```text
AuthProvider
AuthFacade
AuthState
AuthUser
provideAuth(...)
authentication guard
testing utilities
```

The initial adapters should focus on the minimum necessary to validate the architecture.

A generic OIDC adapter and a mock/testing adapter are strong initial candidates.

Additional adapters should only be introduced when there is a concrete requirement.

---

## Non-Goals

The authentication core should not:

- Encode business authorization rules.
- Own tenant selection or tenant lifecycle.
- Expose provider-specific claims throughout the application.
- Reimplement OAuth 2.0 or OpenID Connect protocols.
- Create adapters for every authentication vendor by default.
- Force business features to understand tokens.
- Introduce architectural layers without a concrete need.
- Become a generic identity-management framework.

---

## Guiding Principles

1. **Authentication is a platform capability, not a business feature.**
2. **Business code depends on application contracts, never identity providers.**
3. **Identity providers are replaceable infrastructure.**
4. **Prefer standards such as OIDC over vendor-specific integrations.**
5. **Authentication and authorization remain separate concerns.**
6. **Authentication and tenancy remain separate concerns.**
7. **Provider-specific claims are normalized at the infrastructure boundary.**
8. **Authentication must be trivial to replace in tests.**
9. **Core architecture remains pragmatic rather than ceremonially layered.**
10. **Abstractions must solve real problems.**
