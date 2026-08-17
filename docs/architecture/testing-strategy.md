# Testing Strategy

Tests protect behavior and architectural boundaries rather than a global
coverage quota. SonarQube Cloud evaluates coverage only for new code as one
signal in its CI Quality Gate; it does not change the purpose or scope of tests.

| Scope                | Primary concern                                                 |
| -------------------- | --------------------------------------------------------------- |
| Domain               | Business rules and temporal semantics without Angular.          |
| Application/use case | Orchestration and expected outcomes with ports mocked.          |
| Mapper/repository    | DTO mapping and infrastructure integration contracts.           |
| Component/facade     | Observable UI behavior, accessibility and state transitions.    |
| E2E                  | Critical user journeys across routing and platform integration. |
| Contract             | OpenAPI compatibility and generated-client lifecycle.           |
| Design system        | Interaction, accessibility and visual regressions.              |
| Architecture         | Project tags, scope isolation and forbidden dependency edges.   |

External providers such as identity, Tolgee and telemetry are replaced by
deterministic test adapters. CI should run affected lint, unit tests, build and
relevant e2e/contract checks; flaky tests are defects to remove, not checks to
ignore.

## Test runners

The repository uses different test runners depending on library type:

- **Pure TypeScript libraries** (e.g. `core-ddd`) use Vitest directly via
  `nx:run-commands`. These libraries have no Angular dependency and do not
  require a browser or TestBed.
- **Angular libraries** (e.g. `core-feature-flags`) use
  `@nx/angular:unit-test` (vitest-angular). These tests need TestBed, Angular
  DI, and the Angular compiler.

Both runners produce LCOV coverage reports. The choice is determined by whether
the library depends on Angular.

The pure JavaScript `architecture-enforcement` project uses Vitest through an
Nx `run-commands` target. Its negative cases protect the Nx dependency policy,
while its `check` target validates the tags of the current project graph.
