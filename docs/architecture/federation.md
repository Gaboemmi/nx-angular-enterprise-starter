# Federation Architecture

## Overview

This project follows a **federation-ready, not federation-first** approach.

The application starts as a modular Nx monolith. Features and domains are designed with strong architectural boundaries so they can evolve into independently deployed federated applications if a real organizational or deployment requirement appears.

Module Federation is therefore treated as a **deployment capability**, not as a foundation of the application architecture.

> Features must not need to know whether they are compiled into the host application or deployed as a federated remote.

---

## Goals

The federation strategy aims to:

- Keep the initial architecture simple.
- Preserve strong domain and feature boundaries.
- Avoid premature microfrontend complexity.
- Allow features to evolve into independently deployable applications.
- Minimize architectural changes when introducing federation.
- Keep business logic independent from deployment topology.

The architecture should support the evolution:

```text
Modular Monolith

Application
├── Feature A
├── Feature B
└── Feature C
```

into:

```text
Federated Architecture

Shell
├── Feature A
├── Feature B Remote
└── Feature C Remote
```

without requiring Feature B to redesign its internal architecture.

---

## Core Principle

Federation is a deployment concern.

DDD boundaries, application architecture, domain models, use cases, facades, data access, and UI composition must not depend on Module Federation.

A feature should remain structurally valid regardless of whether it is:

- compiled directly into the application;
- lazy-loaded;
- packaged as an Nx library;
- or exposed as a federated remote.

This separation allows deployment topology to evolve independently from business architecture.

---

## Default Architecture

The default architecture is a **modular monolith inside an Nx monorepo**.

```text
apps/
└── web/

libs/
├── platform/
├── shared/
└── domains/
    ├── feature-a/
    ├── feature-b/
    └── feature-c/
```

Features are compiled and deployed together initially.

Federated applications are not created unless an actual requirement justifies them.

This keeps development, testing, local environments, CI/CD, dependency
management, and deployments simpler during the early stages of a project.

---

## Federation-Ready Boundaries

Being federation-ready does not mean adding Module Federation abstractions everywhere.

It means maintaining boundaries that make future extraction possible.

### Feature autonomy

A feature should own its business behavior and internal implementation.

Other features should not depend directly on its internal:

- components;
- stores;
- use cases;
- infrastructure;
- data sources;
- mappers;
- implementation-specific services.

Cross-domain interaction uses runtime APIs/events, application composition, or
a deliberately extracted stable contract in `scope:shared`. It does not use a
direct TypeScript dependency between business scopes.

### Explicit public APIs

Each project exposes only the API intended for consumers already allowed by the
scope/type matrix.

Internal implementation details remain private.

Conceptually:

```text
Feature A ─X→ Feature B public entry point

Direct cross-scope import: forbidden

Feature A → runtime API/event/shared stable contract ← allowed integration
```

instead of:

```text
Feature A
   │
   ├── imports Feature B store
   ├── imports Feature B component
   └── imports Feature B datasource

✗ Forbidden
```

These boundaries should be enforceable through Nx project boundaries and architecture tooling.

### No deployment assumptions

Feature code must not contain logic that assumes it is running as:

- a host;
- a remote;
- a federated module;
- or a standalone deployment.

Federation-specific configuration belongs at the application/deployment boundary.

---

## Shared Platform Capabilities

Some capabilities naturally belong outside individual business domains.

Examples include:

```text
platform/
├── authentication/
├── authorization/
├── configuration/
├── http/
├── observability/
├── i18n/
└── datetime/

shared/
└── design-system/
```

These capabilities should expose stable contracts that features consume without knowing how the capability is initialized or provided by the host application.

For example, a feature should depend on an authentication contract rather than directly coupling itself to a specific identity provider or federated shell implementation.

The same principle applies to runtime configuration, localization, HTTP infrastructure, and other application-wide capabilities.

---

## Communication Between Features

Direct cross-feature coupling should be minimized.

Prefer, depending on the use case:

1. explicit application contracts;
2. navigation through routes;
3. shared platform abstractions;
4. domain/application events when genuine decoupled communication is required.

Do not introduce an event bus simply to prepare for federation.

Distributed communication patterns should only be introduced when the architecture actually requires them.

---

## Routing

Routing should be the primary composition boundary for large business features.

A feature should preferably expose route-level entry points rather than requiring the application shell to know its internal component structure.

Conceptually:

```text
Shell Router
    │
    ├── /operations
    │      └── Operations Feature
    │
    └── /planning
           └── Planning Feature
```

This provides a natural extraction point if a feature later becomes a remote:

```text
Shell Router
    │
    ├── /operations
    │      └── Operations Remote
    │
    └── /planning
           └── Planning Remote
```

The routing contract remains conceptually stable while the deployment mechanism changes.

---

## When Federation Is Justified

A feature should become federated only when there is a concrete requirement.

Typical reasons include:

- independent deployment;
- independent release cycles;
- separate team ownership;
- organizational boundaries;
- independently scalable frontend delivery;
- composition of applications maintained by different teams.

Application size alone is not sufficient justification.

Neither is the desire to make the architecture appear more "enterprise".

---

## What We Avoid

The project explicitly avoids federation-first architecture.

We do not create:

- unnecessary host/remote applications;
- federation-specific abstractions inside domain code;
- distributed state synchronization without a real requirement;
- cross-remote event buses by default;
- duplicated platform infrastructure per feature;
- microfrontends solely for technical separation.

Technical modularity is achieved first through Nx libraries and architectural boundaries.

Deployment independence is introduced only when necessary.

---

## Migration to Federation

When a feature requires independent deployment, the expected evolution is:

```text
Nx Feature Library
        │
        ▼
Federated Application / Remote
```

The migration should primarily affect:

- application bootstrap;
- federation configuration;
- routing/composition;
- deployment configuration;
- CI/CD;
- runtime integration.

It should **not** require redesigning:

- domain models;
- use cases;
- business rules;
- facades;
- repositories/data sources;
- feature state;
- presentation logic.

If extracting a feature requires extensive changes to its business architecture, the feature was not sufficiently isolated.

---

## Architectural Enforcement

Federation readiness should come primarily from enforceable architecture rather than documentation alone.

Nx project boundaries and architecture tooling should prevent accidental dependencies between domains and layers.

The important invariant is:

```text
Strong boundaries
      ↓
Independent features
      ↓
Optional extraction
      ↓
Federation when required
```

Not:

```text
Module Federation
      ↓
Attempt to create boundaries afterwards
```

---

## Summary

The project adopts the following architectural position:

> **Federation-ready, not federation-first.**

We build a modular monolith with strong domain boundaries first.

Features remain independent from deployment topology.

Module Federation may later provide independent deployment where organizational or operational requirements justify its complexity.

Therefore:

> **Module Federation is an optional deployment capability, not an architectural foundation.**
