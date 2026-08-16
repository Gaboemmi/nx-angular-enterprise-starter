# ADR-013 — Agent-Agnostic AI Harness

**Status:** Accepted  
**Date:** 2026-08

## Context

The starter supports AI-assisted engineering, but teams use different coding
agents and editors. Duplicating architectural guidance in tool-specific files
creates divergent instructions and makes the starter dependent on a provider.

Nx provides `nx configure-ai-agents` as an integration bootstrap. In Nx
23.1.1, it can configure Claude, Codex, Copilot, Cursor, Gemini, and OpenCode,
including Nx MCP connectivity and generated skills. Its generated artifacts are
not the architecture of this repository.

## Decision

The repository owns one agent-agnostic Harness:

```text
AGENTS.md → .ai/ and docs/ → specs/ → .agents/skills/ → generators and enforcement
```

- `AGENTS.md` is the canonical entry point for all agents.
- `docs/`, `specs/`, reusable `.agents/skills/`, generators, and enforcement
  remain tool-neutral and are the source of truth.
- Tool-specific files are small adapters. They may point their agent to
  `AGENTS.md` or configure an optional integration, but must not restate the
  architecture, requirements, or validation rules.
- `nx configure-ai-agents` is optional integration tooling. Review its diff and
  retain only artifacts compatible with this decision; do not accept generated
  rules as a replacement for the Harness.

## Consequences

- Adding or replacing an AI tool does not require rewriting the architecture.
- Repository guidance stays consistent across supported agents.
- Nx MCP and Nx-maintained skills can be adopted selectively and updated
  independently of the Harness.
