# Engineering Harness

The Engineering Harness is the minimal, repository-native context that helps any
AI coding agent make better engineering decisions.

```text
AI agent
   ↓
Engineering Harness
   ↓
Repository
```

## Knowledge

- `AGENTS.md`: always-on entry point.
- `architecture.md`: compact architecture map.
- `decisions/`: concise pointers to decisions that affect implementation.
- `skills/`: task-specific procedures when proven conventions exist.

## Enforcement

Nx, ESLint, TypeScript, automated tests, and CI enforce repository rules. The
Harness explains intent and procedures that tooling cannot reliably infer.

AI tools are replaceable; repository knowledge is not. Add Harness content only
when it changes agent behavior or improves consistency. Do not document rules
that the environment can enforce, and do not duplicate `docs/`.

## Responsibility boundaries

- Angular knows Angular: use the official `angular-developer` Agent Skill for
  framework conventions and current Angular guidance.
- Nx knows Nx: use Nx skills, MCP tools, generators, and enforcement for
  workspace structure and task execution.
- This Harness knows this repository: document its domain boundaries, ownership,
  dependency direction, and decisions that neither Angular nor Nx can infer.

Do not duplicate framework rules such as component APIs, reactivity primitives,
dependency-injection style, template control flow, or NgModule guidance here.

## Agent adapters

`AGENTS.md` is the canonical entry point. Tool-specific files only route their
agent to that entry point or configure an optional integration; they must not
duplicate architecture, requirements, or validation instructions. Read the
[agent-agnostic Harness decision](decisions/agent-agnostic-ai-harness.md)
before changing adapters or adopting `nx configure-ai-agents` output.
