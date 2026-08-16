# Architecture map

This is an Nx monorepo for a modern Angular enterprise application. The intended
shape is a domain-oriented modular monolith: organize business code around
capabilities, keep ownership explicit, and use libraries as meaningful
boundaries as the repository grows.

## Dependency direction

```text
delivery / presentation
          ↓
     application
          ↓
        domain

infrastructure → implements domain or application contracts
```

Feature and business boundaries should remain strict. Shared, core, and
configuration areas may be more pragmatic, but must not become a home for
business logic without clear ownership. Features expose the smallest useful
public API; complex features may use a facade for their presentation boundary.

`@nx-angular-enterprise-starter/core/ddd` provides framework-independent
`UseCase<Input, Output>` and `Mapper<From, To>` contracts. Use their direct
`execute`, `map`, and `mapArray` operations; do not introduce generic executor
or mapper-service indirection without an actual cross-cutting responsibility.

## Repository positions

- Keep provider SDKs and transport concerns behind infrastructure boundaries.
- The design system owns reusable UI behavior, accessibility patterns, and
  tokens; applications own product and domain composition.
- Keep features independent of deployment topology: federation-ready, not
  federation-first.
- Treat cross-domain integration as an explicit contract, not an internal import.

Read the relevant detailed source before making architectural decisions:

- [Principles](../docs/architecture/principles.md)
- [Domain-driven architecture](../docs/architecture/ddd.md)
- [Core DDD primitives](../docs/architecture/core.md)
- [State management](../docs/architecture/state-management.md)
- [Authentication](../docs/architecture/authentication.md)
- [Authorization and tenancy](../docs/architecture/authorization-and-tenancy.md)
- [Internationalization](../docs/architecture/i18n-l10n.md) and
  [date/time](../docs/architecture/datetime.md)
- [Runtime configuration](../docs/architecture/runtime-configuration.md),
  [OpenAPI](../docs/architecture/openapi.md),
  [HTTP and errors](../docs/architecture/http-and-errors.md), and
  [observability](../docs/architecture/observability.md)
- [Design system](../docs/architecture/design-system.md)
- [Federation](../docs/architecture/federation.md)
- [Executable architecture](../docs/architecture/enforcement.md) and
  [testing strategy](../docs/architecture/testing-strategy.md)
- [Accepted ADRs](../docs/decisions/README.md)
