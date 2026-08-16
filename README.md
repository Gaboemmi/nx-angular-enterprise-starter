# Nx Angular Enterprise Starter

An opinionated, production-oriented foundation for modern enterprise Angular
applications built with Nx.

This repository starts with an understandable modular monolith and provides the
architecture, decision records, and executable safeguards needed to evolve it
without losing domain boundaries, quality, or deployment flexibility. It is not
a demo application or a framework on top of Angular: its purpose is to make the
simplest path the architecturally correct one.

## Current status

The repository is in its foundation stage. The Angular application and the
first framework-independent DDD primitives are implemented; the wider platform
architecture is designed and documented, ready to be adopted incrementally.

| Area | Status |
| --- | --- |
| Nx workspace, standalone Angular application, strict TypeScript, `OnPush`, and zoneless compatibility | Implemented |
| Nx project tags and ESLint dependency-boundary rules | Implemented foundation |
| `UseCase` and `Mapper` primitives in `@nx-angular-enterprise-starter/core/ddd` | Implemented |
| DDD, authentication, authorization, i18n, date/time, OpenAPI, design system, and testing strategy | Architecture defined |
| Provider integrations for auth, Tolgee, OpenAPI, runtime configuration, observability, and design system | Not yet implemented |

An accepted ADR records a decision; it does not mean its technical integration
is already complete. See [executable architecture](docs/architecture/enforcement.md)
for the adoption status and next increments.

## Guiding principles

- Organize business code around domains and capabilities, not technical folders.
- Keep dependencies pointed at stable concepts: domain and application code do
  not know HTTP, provider SDKs, or UI details.
- Start as a modular monolith: **federation-ready, not federation-first**.
- Use modern Angular deliberately: standalone APIs, signals where they add
  value, `OnPush`, and zoneless-compatible code.
- Keep external infrastructure replaceable behind explicit contracts when that
  boundary protects a real responsibility.
- Enforce important rules through tooling, tests, and CI rather than prose
  alone.
- Prefer the minimum architecture that preserves maximum clarity.

## Architecture

Business-feature responsibilities follow this dependency direction:

```text
presentation -> application -> domain
infrastructure -> implements domain or application contracts
```

Not every feature needs every layer. A simple feature may keep local state,
while a complex feature may expose a facade and separate use cases, ports,
repositories, and mappers. The application composes domains and platform
capabilities; cross-domain communication happens through public APIs, explicit
contracts, routes, or events when justified—not through internal implementation
imports.

Read the [domain-driven architecture guide](docs/architecture/ddd.md) before
making structural decisions.

### Executable boundaries

Libraries receive both a scope tag and a responsibility tag:

```text
scope:domain | scope:platform | scope:shared | scope:app
type:domain | type:application | type:infrastructure | type:presentation |
type:ui | type:util | type:platform
```

Nx and ESLint enforce the principal dependency directions. For example, domain
libraries may depend only on domain libraries and utilities; presentation may
use application APIs and UI/util libraries, but never infrastructure directly.
The full policy is in [executable architecture](docs/architecture/enforcement.md).

## Platform architecture

The following capabilities have documented boundaries and adoption guidance:

- [Authentication](docs/architecture/authentication.md) and
  [authorization/tenancy](docs/architecture/authorization-and-tenancy.md)
- [Internationalization and localization](docs/architecture/i18n-l10n.md) and
  [date/time semantics](docs/architecture/datetime.md)
- [Runtime configuration](docs/architecture/runtime-configuration.md)
- [OpenAPI contracts](docs/architecture/openapi.md),
  [HTTP and errors](docs/architecture/http-and-errors.md), and
  [observability](docs/architecture/observability.md)
- [Application-owned design system](docs/architecture/design-system.md)
- [State management](docs/architecture/state-management.md),
  [testing strategy](docs/architecture/testing-strategy.md), and
  [future federation](docs/architecture/federation.md)

## Documentation and decisions

The project deliberately separates its sources of truth:

```text
Vision -> Architecture -> ADRs -> Specifications -> Implementation
```

- [Project vision](docs/vision.md)
- [Engineering principles](docs/architecture/principles.md)
- [Architecture documentation](docs/architecture/)
- [Architecture Decision Records](docs/decisions/README.md)
- [Engineering Harness for contributors and AI agents](AGENTS.md)

ADRs explain why durable choices were made. Architecture guides describe how
those choices shape the system. Specifications should define implementable
changes and acceptance criteria.

## Engineering Harness

The repository includes a small, agent-agnostic Engineering Harness that gives
both people and AI coding agents durable repository context.

- [`AGENTS.md`](AGENTS.md) is the always-on entry point.
- [`.ai/architecture.md`](.ai/architecture.md) is the compact architecture map.
- [`.ai/decisions/`](.ai/decisions/) contains short, agent-oriented decision pointers.
- [`.ai/skills/`](.ai/skills/) contains repository-specific procedures when a
  recurring convention has been proven.

Framework guidance belongs to Angular; workspace operations and generators
belong to Nx. The Harness owns only repository-specific architecture, ownership,
dependency direction, decisions, and validation guidance. See
[ADR-013](docs/decisions/ADR-013-agent-agnostic-ai-harness.md) for the model.

## Getting started

Prerequisites: Node.js 22 (the CI runtime) and npm.

```bash
npm ci
npx nx serve app
```

In PowerShell environments that restrict script execution, use `npx.cmd` in
place of `npx`.

## Validation

Run validation through Nx and target the project affected by the change:

```bash
npx nx lint app
npx nx test app
npx nx build app
npx nx e2e app-e2e
```

The CI pipeline runs lint, unit tests, and builds for all projects on pull
requests and pushes to `main`.

For an architectural or configuration change, run the affected lint, tests, and
build; review project tags and dependencies; and update the corresponding
architecture document or ADR when a durable decision changes.

## Contributing

Before implementing a change, read [`AGENTS.md`](AGENTS.md) and the
[architecture map](.ai/architecture.md). Keep changes focused, preserve feature
and domain ownership, avoid using `shared` as a home for business logic, and do
not let provider SDKs leak into domain code.

Facades, stores, use cases, repositories, and mappers are tools—not mandatory
layers. Introduce them only when they protect a real responsibility.
