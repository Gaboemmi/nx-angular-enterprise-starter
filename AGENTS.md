# Engineering Harness

This repository is an Angular enterprise reference architecture built with Nx. It
is evolving from a generated application into a domain-oriented modular monolith.

## Working principles

- Prefer the simplest change that solves the task.
- Angular knows Angular: use the official `angular-developer` Agent Skill for
  framework conventions. Nx knows Nx; this Harness owns repository architecture.
- Follow established patterns before introducing an abstraction or dependency.
- Respect feature and architectural boundaries; avoid unrelated changes.
- Keep business code owned by its domain or feature, not generic shared areas.
- Prefer rules enforced by Nx, ESLint, TypeScript, tests, or CI over prose.
- Before an architectural or configuration change, read the relevant `.ai/` map
  and linked documentation.
- After implementing any code or configuration change, run `npm run format`
  before the remaining validation steps.
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

## AI agent integrations

This file is the canonical, agent-agnostic entry point. Tool-specific adapter
files may route an agent here or configure an optional integration, but they do
not own repository architecture or workflow rules. See
[ADR-013](docs/decisions/ADR-013-agent-agnostic-ai-harness.md).

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
