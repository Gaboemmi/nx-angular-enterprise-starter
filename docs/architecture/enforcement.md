# Executable Architecture

`tools/enforcement/` contains the repository-owned configuration and operating
notes for ESLint, Sheriff, Nx boundaries, tests, and CI. This document remains
the architectural policy; implementation details must not introduce a competing
policy.

## Enforcement layers

| Layer           | Purpose                                                                | Current basis                                     |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------------- |
| TypeScript      | Make invalid contracts hard to represent.                              | Strict compiler settings.                         |
| ESLint          | Catch static code and import violations early.                         | Flat configuration in `eslint.config.mjs`.        |
| Nx boundaries   | Enforce allowed project dependencies.                                  | Project tags and `@nx/enforce-module-boundaries`. |
| Sheriff         | Add structural restrictions only where Nx and ESLint are insufficient. | Not installed.                                    |
| Tests           | Protect behavior and rules static analysis cannot express.             | Nx unit-test and e2e targets.                     |
| CI              | Run required checks consistently before integration.                   | Optional provider template; disabled by default.  |
| SonarQube Cloud | Assess quality and security of new code and enforce its Quality Gate.  | One project for the Nx monorepo.                  |

Do not duplicate a rule across layers without a concrete reason. Prefer the
smallest deterministic mechanism that catches the failure.

## SonarQube Cloud

SonarQube Cloud is an independent, CI-only quality gate. It complements, but
does not replace, TypeScript, ESLint, Nx module boundaries, repository-owned
architectural rules, or tests. Those layers retain ownership of their
respective concerns.

The workspace is analyzed as one SonarQube Cloud project. Nx remains the owner
of library and domain granularity. Test targets produce LCOV reports in
`coverage/app/lcov.info`, `coverage/core-ddd/lcov.info`,
`coverage/core-feature-flags/lcov.info`, `coverage/core-i18n/lcov.info`, and
`coverage/architecture-enforcement/lcov.info`; add a report path to
`sonar-project.properties` whenever a new test target emits coverage.

The Quality Gate is configured in SonarQube Cloud using Clean as You Code: no
new bugs or vulnerabilities, an A rating for reliability, security and
maintainability, at least 80% coverage on new code, and at most 3% duplicated
lines on new code. These are starting thresholds, not a global coverage quota;
they should be recalibrated with evidence as the starter gains real features.

When a CI provider is adopted, it activates the scan once the repository
variables `SONAR_ORGANIZATION` and `SONAR_PROJECT_KEY`, plus the `SONAR_TOKEN`
secret, are configured. The GitHub Actions template waits for and fails on the
Quality Gate. Until then, the Sonar step is skipped so a fork can establish its
own Cloud project without inheriting credentials.

The ESLint baseline composes `@eslint/js` recommended,
`typescript-eslint` `strictTypeChecked` and `stylisticTypeChecked`, plus
`angular-eslint` TypeScript, template and template-accessibility recommended
rules. Type-aware rules use the TypeScript project service. The `*-all`
presets are intentionally excluded: they are not a stable application
baseline.

## Nx tags

Libraries use a scope tag and a responsibility tag:

```text
scope:<bounded-context> | scope:platform | scope:shared | scope:app
type:app | type:e2e | type:shell | type:feature | type:ui |
type:application | type:domain | type:infrastructure | type:platform | type:util
```

The application already has `scope:app,type:app`. New libraries must receive
tags when created; untagged libraries are not accepted as an escape hatch.
Business scopes are registered in
`tools/architecture-enforcement/business-scopes.json`; do not add an ad hoc
business `scope:*` tag manually. The shell generator registers a context and
applies its exact scope.

`presentation` is a conceptual responsibility, not a project tag. Use
`type:shell` for context composition, `type:feature` for route/container
behavior, and `type:ui` for presentational components. Keep external adapters,
DTOs, datasources, and repository implementations under `type:infrastructure`;
do not introduce `type:data-access` as a second name.

Legal matrix cells are intentionally sparse:

| Scope kind                | Allowed project types                                                       |
| ------------------------- | --------------------------------------------------------------------------- |
| `scope:app`               | `app`, `e2e`, `ui`, `util`                                                  |
| `scope:platform`          | `platform`, `ui`, `util`                                                    |
| `scope:shared`            | `domain`, `ui`, `util`                                                      |
| `scope:<bounded-context>` | `shell`, `feature`, `ui`, `application`, `domain`, `infrastructure`, `util` |

Business projects live below `libs/domains/<bounded-context>/`. The workspace
check rejects invalid cells, reserved-scope labels below `libs/domains`, stale
scope registrations, and dependency edges whose legality depends on both tags.

## Dependency policy

- `type:domain` may depend only on `type:domain` and `type:util`.
- `type:application` may use domain contracts and utilities.
- `type:infrastructure` may implement domain/application contracts and use
  platform infrastructure.
- `type:app` imports only shells and cross-cutting platform/UI/util libraries.
- `type:shell` is the domain composition boundary: it may load its own features,
  wire its infrastructure providers, and use application/domain/platform/UI/util
  APIs.
- `type:feature` may use application/domain/platform/UI/util APIs, but may not
  depend on another feature or on a shell.
- `type:ui` may use domain types and UI/util libraries, but not application,
  feature, shell, platform, or infrastructure projects.
- `type:util` may depend only on another utility.
- `type:e2e` exercises the application delivery surface and may use
  testing-oriented app/platform/UI/util contracts, but it does not import a
  business shell or feature.
- Apps compose business capabilities through their shells; a shell owns routing,
  feature composition and route-level providers for one bounded context.

These rules are enforced through `@nx/enforce-module-boundaries` plus the
repository-owned graph check for rules that depend on a scope/type combination.
Public entry points encapsulate allowed project dependencies; they do not permit
direct imports between bounded-context scopes. Cross-context collaboration uses
runtime APIs/events, application composition, or a deliberately extracted stable
contract in `scope:shared`. When a new valid dependency does not fit this matrix,
change this document and the executable policy in the same pull request.

### Vertical isolation

Each registered bounded context receives a generated scope constraint. A
business project may depend only on its own scope, `scope:platform`, and
`scope:shared`. Type constraints then narrow that set independently. This makes
`orders → billing`, `app → feature`, and `feature → feature` invalid even when
their TypeScript APIs are public.

The policy and its negative regression cases live in the
`architecture-enforcement` Nx project. Run both targets after changing tags,
the dependency matrix, or the shell generator:

```bash
npx nx check architecture-enforcement
npx nx test architecture-enforcement
```

Nx project boundaries cannot distinguish conceptual folders inside one
project. When a real vertical groups responsibilities in one library, preserve
dependency direction through its local design and tests; split the project or
add a focused lint rule only when a demonstrated violation requires it.

## Adoption status

An accepted ADR records a decision, not necessarily its completed implementation.
The current foundation has three states:

| Area                                                 | State                  | Next executable increment                                             |
| ---------------------------------------------------- | ---------------------- | --------------------------------------------------------------------- |
| Nx boundaries                                        | Implemented foundation | Register each context at its first Nx boundary; extend rule tests.    |
| Angular conventions                                  | Delegated              | Use the official Angular Agent Skill.                                 |
| Feature flags and i18n base                          | Implemented foundation | Add provider adapters and application integration when required.      |
| Auth, OpenAPI, design system                         | Designed               | Implement a platform library and its test adapter before feature use. |
| Runtime config, errors, observability, authorization | Designed               | Add the respective typed platform contracts.                          |

No business bounded context is registered yet. The executable matrix is ready
for the first discovered vertical; examples such as `orders` are illustrative.

## Change protocol

An enforcement change must state the failure it prevents, update this policy and
its owning implementation together, and include an executable regression check
when configuration alone is insufficient. Run the relevant local target before
relying on CI.
