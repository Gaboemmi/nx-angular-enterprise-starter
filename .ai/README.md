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
