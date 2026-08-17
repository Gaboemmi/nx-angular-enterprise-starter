# SonarQube Cloud quality gate

See [ADR-016](../../docs/decisions/ADR-016-sonarqube-cloud-quality-gate.md).

SonarQube Cloud is a CI-only, one-project quality gate for the monorepo. It
checks new-code quality and security independently; it never replaces
TypeScript, ESLint, Nx boundaries, repository architecture rules or tests.

When adding a coverage-producing test target, add its LCOV report to
`sonar-project.properties` and keep the CI Quality Gate aligned with
`docs/architecture/enforcement.md`.
