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

Business code follows vertical slicing: a cohesive bounded context is the
vertical, and domain/application/infrastructure/presentation responsibilities
live inside it as complexity requires. Do not create a vertical for a screen or
technical concern. Cross-vertical work uses the smallest explicit public
contract; never import another vertical's internals.

Business models belong to their bounded context. Do not reuse a model merely
because another context names the same real-world concept; matching shape is
not a shared contract. Frontend application and view models may follow
user-facing needs instead of backend topology, but a screen alone is not a new
bounded context.

Use [Event Storming](../docs/architecture/event-storming.md) selectively to
discover events, invariants, ownership, and context relationships before fixing
the Nx shape of a new or ambiguous business capability. It is not required for
trivial changes and does not imply event sourcing or asynchronous messaging.

## Library composition model

Libraries use Nx tags to declare scope and responsibility:

```text
scope:<bounded-context> | scope:platform | scope:shared | scope:app
type:app | type:e2e | type:shell | type:feature | type:ui |
type:application | type:domain | type:infrastructure | type:platform | type:util
```

`presentation` is a conceptual responsibility represented at project level by
`shell`, `feature`, or `ui`. The matrix classifies justified boundaries; it does
not require one project for every scope/type cell.

An app composes each bounded context through a `type:shell` library. A shell
owns its route composition and may load the context's features; features never
import, lazy-load, or otherwise compose one another. Read
[application composition](../docs/architecture/application-composition.md)
before adding routes that span features.

The full dependency policy is in
[executable architecture](../docs/architecture/enforcement.md).

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
- Do not import between bounded-context scopes. Use runtime APIs/events,
  application composition, or a deliberately extracted stable contract in
  `scope:shared`.

Read the relevant detailed source before making architectural decisions:

- [Principles](../docs/architecture/principles.md)
- [Domain-driven architecture](../docs/architecture/ddd.md)
- [Event Storming](../docs/architecture/event-storming.md)
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
- [Application composition](../docs/architecture/application-composition.md)
- [Executable architecture](../docs/architecture/enforcement.md) and
  [testing strategy](../docs/architecture/testing-strategy.md)
- [Accepted ADRs](../docs/decisions/README.md)
