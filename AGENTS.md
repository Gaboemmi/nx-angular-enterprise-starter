# Engineering Harness

This repository is an Angular enterprise reference architecture built with Nx. It
is evolving from a generated application into a domain-oriented modular monolith.

## Working principles

- Prefer the simplest change that solves the task.
- Follow established patterns before introducing an abstraction or dependency.
- Respect feature and architectural boundaries; avoid unrelated changes.
- Keep business code owned by its domain or feature, not generic shared areas.
- Prefer rules enforced by Nx, ESLint, TypeScript, tests, or CI over prose.
- Before an architectural or configuration change, read the relevant `.ai/` map
  and linked documentation.
- Validate the affected scope and review the final diff before considering work
  complete.

## Relevant context

- [Harness overview](.ai/README.md)
- [Architecture map](.ai/architecture.md)
- [Validation](.ai/validation.md)
- [Agent-oriented decisions](.ai/decisions/README.md)
- [Task procedures](.ai/skills/README.md)
- [Extended project documentation](docs/vision.md),
  [architecture](docs/architecture/), and [ADRs](docs/decisions/)
