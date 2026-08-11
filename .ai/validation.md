# Validation

Choose validation that matches the change and run it against the affected Nx
project whenever possible. This repository currently exposes `lint`, `test`,
and `build` targets for `app`; Playwright supplies the `app-e2e` e2e target.

## Normal code change

- Run the affected project's lint target, for example `npx nx lint app`.
- Run its unit tests when behavior changes, for example `npx nx test app`.
- Review the generated diff for unintended changes.

## Architectural or configuration change

- Run lint and relevant tests.
- Build affected applications or libraries; the current application command is
  `npx nx build app`.
- Verify dependency boundaries and project configuration when they changed.

## User-facing flow

- Run relevant automated tests.
- Run the applicable e2e target, currently `npx nx e2e app-e2e`, and perform
  browser validation when the change cannot be adequately covered by tests.

Do not claim validation that was not run. If a command is unavailable or fails
for an unrelated reason, report it with the affected scope.
