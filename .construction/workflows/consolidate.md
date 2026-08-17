# Workflow: Consolidate

Post-implementation consolidation review. After a feature, refactor, or
significant change has been implemented, verify that documentation,
harness, consistency, and architecture are all in alignment.

## Trigger

- "consolidate"
- "post-implementation review"
- "construction consolidate"

## Steps

### 1. Identify What Was Implemented

Determine the scope of recent work:

1. `git log --oneline -10` — recent commits
2. `git diff --stat HEAD~5..HEAD` — files changed in recent work
3. Identify the primary area of change (feature, library, tooling, docs)
4. If the user specifies a scope, use that instead

### 2. Load Context

Read:

- `.construction/knowledge/construction-principles.md`
- `.ai/architecture.md`
- The relevant `docs/architecture/` files for the affected area
- Any ADRs relevant to the decisions made

### 3. Dispatch Targeted Agents

| Agent                 | Consolidation Focus                                                  |
| --------------------- | -------------------------------------------------------------------- |
| docs-guardian         | Were all relevant documentation files updated during implementation? |
| harness-architect     | Does the product harness reflect the new patterns?                   |
| consistency-reviewer  | Does the implementation follow established patterns?                 |
| architecture-guardian | Does the implementation match the architectural intent?              |
| angular-expert        | Are Angular patterns modern throughout?                              |
| clean-code-reviewer   | Is the code exemplary for a starter?                                 |
| simplicity-guardian   | Were any unnecessary abstractions introduced?                        |

Dispatch all seven, but scope each agent to the specific area of change.
They do not need to audit the entire repository.

### 4. Documentation Verification

Specifically check:

- Was the relevant `docs/architecture/` file updated?
- Was an ADR created if a new decision was made?
- Was `.ai/architecture.md` updated if the structure changed?
- Were `.ai/decisions/` summaries updated?
- Were `.ai/skills/` updated if a new pattern was established?
- Does the README still reflect reality?

### 5. Harness Verification

Check if the product harness needs updates:

- Are new conventions documented?
- Could new rules be automated via ESLint/Nx?
- Do existing skills need updating?
- Is AGENTS.md still accurate?

### 6. Produce Consolidation Report

```text
## Consolidation Report

### Scope
<what was implemented and when>

### Documentation Status
- Updated: <list of docs that were correctly updated>
- Missing: <list of docs that should have been updated>

### Harness Status
- Current: <harness accurately reflects new patterns>
- Updates needed: <list of harness updates needed>

### Pattern Consistency
- Consistent: <areas that follow established patterns>
- Inconsistent: <areas that diverge>

### Corrective Actions
1. <action> — Priority: <high/medium/low>
2. ...
```

### 7. Present to User

Display the consolidation report. The user decides which corrective
actions to implement.

## Expected Duration

Moderate. Focused on the specific implementation area, not the full repo.

## Output

A consolidation report that ensures nothing was left in an inconsistent
state after implementation.
