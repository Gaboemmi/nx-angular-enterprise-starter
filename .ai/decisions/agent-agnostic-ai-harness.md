# Agent-agnostic AI Harness

Read [ADR-013](../../docs/decisions/ADR-013-agent-agnostic-ai-harness.md).

`AGENTS.md` is the canonical entry point. Tool adapters may only route an agent
to it or configure optional integrations; they must not duplicate repository
architecture, requirements, or validation instructions.
