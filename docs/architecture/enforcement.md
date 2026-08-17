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
`coverage/app/lcov.info`, `coverage/core-ddd/lcov.info`, and
`coverage/core-feature-flags/lcov.info`; add a report path to
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
scope:domain | scope:platform | scope:shared | scope:app
type:domain | type:application | type:infrastructure | type:presentation |
type:ui | type:util | type:platform | type:shell | type:feature
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
- `type:app` imports only shells and cross-cutting platform/UI/util libraries.
- `type:shell` is the domain composition boundary: it may load its own features,
  and use application/domain/platform/UI/util APIs, but it does not access
  infrastructure directly.
- `type:feature` may use application/domain/platform/UI/util APIs, but may not
  depend on another feature or on a shell.
- Apps compose business capabilities through their shells; a shell owns routing,
  feature composition and route-level providers for one bounded context.

These rules are enforced through `@nx/enforce-module-boundaries`. Public entry
points are the only supported cross-domain imports. When a new valid dependency
does not fit this matrix, change this document and the lint configuration in the
same pull request.

### Current vertical-isolation limit

The current `scope:*` tags classify broad repository areas (`domain`,
`platform`, `shared`, and `app`); they do not identify individual business
verticals. Consequently, the current matrix enforces layer and feature/shell
direction, but cannot mechanically distinguish one future bounded context from
another. The documented rule remains: do not import another vertical's
internals, and use the smallest explicit public contract when integration is
needed.

Before adding per-vertical dependency constraints, record a decision that
defines the vertical identity/tag scheme, approved contract shape, and when a
bounded context needs separate Nx libraries. Update this policy, the ESLint
matrix, generators, and negative-boundary tests together. Do not claim
cross-vertical isolation is executable until that decision is implemented.

## Adoption status

An accepted ADR records a decision, not necessarily its completed implementation.
The current foundation has three states:

| Area                                                 | State     | Next executable increment                                             |
| ---------------------------------------------------- | --------- | --------------------------------------------------------------------- |
| Nx boundaries                                        | Started   | Tag each new library and add boundary tests.                          |
| Angular conventions                                  | Delegated | Use the official Angular Agent Skill.                                 |
| Auth, i18n, OpenAPI, design system                   | Designed  | Implement a platform library and its test adapter before feature use. |
| Runtime config, errors, observability, authorization | Designed  | Add the respective typed platform contracts.                          |

## Change protocol

An enforcement change must state the failure it prevents, update this policy and
its owning implementation together, and include an executable regression check
when configuration alone is insufficient. Run the relevant local target before
relying on CI.
