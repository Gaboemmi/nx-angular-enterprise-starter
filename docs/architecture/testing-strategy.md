# Testing Strategy

Tests protect behavior and architectural boundaries rather than a coverage quota.

| Scope | Primary concern |
| --- | --- |
| Domain | Business rules and temporal semantics without Angular. |
| Application/use case | Orchestration and expected outcomes with ports mocked. |
| Mapper/repository | DTO mapping and infrastructure integration contracts. |
| Component/facade | Observable UI behavior, accessibility and state transitions. |
| E2E | Critical user journeys across routing and platform integration. |
| Contract | OpenAPI compatibility and generated-client lifecycle. |
| Design system | Interaction, accessibility and visual regressions. |

External providers such as identity, Tolgee and telemetry are replaced by
deterministic test adapters. CI should run affected lint, unit tests, build and
relevant e2e/contract checks; flaky tests are defects to remove, not checks to
ignore.

