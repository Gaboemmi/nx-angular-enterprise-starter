# ADR-018 — Architecture Matrix and Nx Tag Identity

**Status:** Accepted
**Date:** 2026-08-18

## Context

The repository already models bounded contexts as verticals and domain,
application, infrastructure, and presentation as responsibilities inside each
vertical. Its initial Nx tags used `scope:domain` as a broad category, so Nx
could enforce dependency direction by responsibility but could not distinguish
one bounded context from another.

The starter needs deterministic placement and dependency feedback without
forcing every architectural responsibility into a separate library.

## Decision

Use an Architecture Matrix with two tag dimensions:

```text
scope:<bounded-context> × type:<responsibility>
```

Business projects use their bounded-context identity, for example
`scope:orders`. Reserved non-business scopes are `scope:app`, `scope:platform`,
and `scope:shared`.

The canonical project types are:

```text
type:app | type:e2e | type:shell | type:feature | type:ui |
type:application | type:domain | type:infrastructure |
type:platform | type:util
```

`presentation` remains a conceptual DDD responsibility. At an Nx project
boundary it is represented by `shell`, `feature`, or `ui`, according to the
project's role. External adapters, DTOs, datasources, repository
implementations, and provider SDKs remain `type:infrastructure`; the repository
does not introduce the narrower alias `type:data-access`.

The matrix classifies projects that exist. It does not require a library for
every cell or a fixed Facade/Store/UseCase/Repository/Datasource pipeline.
Projects are split only when a boundary protects ownership, dependency
direction, reuse, or independent evolution.

Each bounded context with an Nx project boundary is registered in
`tools/architecture-enforcement/business-scopes.json`. The shell generator
registers delivered contexts automatically and tags the shell with the
context's exact scope; a context with no application delivery may be registered
without creating a shell. Generated dependency constraints allow a business
scope to depend only on itself, platform, and shared projects. Type constraints
apply independently, and the repository check validates legal scope/type cells
and the few dependency rules that require both dimensions.

Business projects live under `libs/domains/<bounded-context>/`. Reserved scopes
cannot be used there, so `scope:shared` or `scope:platform` cannot become an
escape hatch from vertical isolation.

The application composes bounded-context shells. A shell composes only features
and infrastructure providers from its own context. A context does not import
another context directly, including through its public entry point.
Cross-context collaboration uses runtime APIs/events, application composition,
or a deliberately extracted stable contract in `scope:shared`; public API means
encapsulation, not permission to cross a scope boundary.

The Design System starts as `scope:shared,type:ui`: it is domain-independent UI
with a deliberate public API. A distinct scope or a third `visibility:*`
dimension requires evidence and a separate decision.

## Consequences

- Nx can reject direct dependencies between registered bounded contexts.
- Every project has exactly one scope and one type from the canonical policy.
- The tag vocabulary distinguishes Angular delivery roles without duplicating
  the conceptual `presentation` layer.
- New bounded contexts must be created through domain discovery and registered
  when their first Nx project boundary is added. The shell generator performs
  this registration automatically for contexts delivered by an application.
- Folder-level separation inside one Nx project is not automatically enforced
  by project tags; tests or narrower project boundaries are added when a real
  vertical demonstrates that need.
- The repository can validate the policy before it contains a sample business
  context, but generators for other cells remain deferred until patterns repeat.

## Related documentation

- `docs/architecture/ddd.md`
- `docs/architecture/enforcement.md`
- `docs/architecture/application-composition.md`
- `docs/decisions/ADR-004-architecture-boundaries.md`
- `docs/decisions/ADR-017-shell-library-pattern.md`
