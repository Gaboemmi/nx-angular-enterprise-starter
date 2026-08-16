# Executable Architecture

`tools/enforcement/` contains the repository-owned configuration and operating
notes for ESLint, Sheriff, Nx boundaries, tests, and CI. This document remains
the architectural policy; implementation details must not introduce a competing
policy.

## Enforcement layers

| Layer         | Purpose                                                                | Current basis                                     |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------------------- |
| TypeScript    | Make invalid contracts hard to represent.                              | Strict compiler settings.                         |
| ESLint        | Catch static code and import violations early.                         | Flat configuration in `eslint.config.mjs`.        |
| Nx boundaries | Enforce allowed project dependencies.                                  | Project tags and `@nx/enforce-module-boundaries`. |
| Sheriff       | Add structural restrictions only where Nx and ESLint are insufficient. | Not installed.                                    |
| Tests         | Protect behavior and rules static analysis cannot express.             | Nx unit-test and e2e targets.                     |
| CI            | Run required checks consistently before integration.                   | GitHub Actions workflow.                          |

Do not duplicate a rule across layers without a concrete reason. Prefer the
smallest deterministic mechanism that catches the failure.

The ESLint baseline composes `@eslint/js` recommended,
`typescript-eslint` `strictTypeChecked` and `stylisticTypeChecked`, plus
`angular-eslint` TypeScript, template and template-accessibility recommended
rules. Type-aware rules use the TypeScript project service. The `*-all`
presets are intentionally excluded: they are not a stable application
baseline.

## Nx tags

Libraries use a scope tag and a responsibility tag:

```text
scope:domain | scope:platform | scope:shared | scope:app
type:domain | type:application | type:infrastructure | type:presentation |
type:ui | type:util | type:platform
```

The application already has `scope:app,type:app`. New libraries must receive
tags when created; untagged libraries are not accepted as an escape hatch.

## Dependency policy

- `type:domain` may depend only on `type:domain` and `type:util`.
- `type:application` may use domain contracts and utilities.
- `type:infrastructure` may implement domain/application contracts and use
  platform infrastructure.
- `type:presentation` uses application APIs and UI/util libraries, never
  infrastructure directly.
- Apps compose domains, platform and shared capabilities.

These rules are enforced through `@nx/enforce-module-boundaries`. Public entry
points are the only supported cross-domain imports. When a new valid dependency
does not fit this matrix, change this document and the lint configuration in the
same pull request.

## Adoption status

An accepted ADR records a decision, not necessarily its completed implementation.
The current foundation has three states:

| Area                                                 | State    | Next executable increment                                             |
| ---------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| Nx boundaries                                        | Started  | Tag each new library and add boundary tests.                          |
| Angular conventions                                  | Delegated | Use the official Angular Agent Skill.                                |
| Auth, i18n, OpenAPI, design system                   | Designed | Implement a platform library and its test adapter before feature use. |
| Runtime config, errors, observability, authorization | Designed | Add the respective typed platform contracts.                          |

## Change protocol

An enforcement change must state the failure it prevents, update this policy and
its owning implementation together, and include an executable regression check
when configuration alone is insufficient. Run the relevant local target before
relying on CI.
