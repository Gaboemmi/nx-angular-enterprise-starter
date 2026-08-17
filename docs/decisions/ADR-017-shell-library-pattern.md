# ADR-017: Shell libraries own domain composition

- Status: Accepted
- Date: 2026-08-17

## Context

Features must remain independent so bounded contexts can evolve without
cross-feature coupling or deployment-topology assumptions. Lazy-loaded imports
remain architectural dependencies, so lazy loading alone cannot make a
feature-to-feature dependency valid.

## Decision

Each bounded context is composed through a `type:shell` library. The app loads
the shell's public route contract; the shell may load its `type:feature`
libraries. Features do not import, lazy-load or compose other features.

Shells are Angular libraries with a minimal public route-array API. They own
routing and may own route-level providers, guards, resolvers and layout where
required. They are not a Module Federation abstraction and they do not make
every domain require a component or extra state layer.

The workspace provides a local `shell` generator and Nx module-boundary rules
for `type:app`, `type:shell` and `type:feature`.

## Consequences

- The application remains a delivery-level composition point rather than a
  catalog of business feature routes.
- Feature-to-feature imports are rejected when projects carry the corresponding
  tags.
- A context can later move behind a different deployment boundary without
  changing its internal feature composition.
- The pattern adds one library per bounded context only when that context has
  multiple routes or features to compose.
