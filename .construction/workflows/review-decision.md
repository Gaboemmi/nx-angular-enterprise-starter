# Workflow: Review Decision

Evaluate a proposed architecture decision against the existing body of
accepted ADRs and architectural principles. Detect conflicts, assess
simplicity, and produce a recommendation.

## Trigger

- "review decision"
- "evaluate ADR"
- "should we decide X"
- "construction decide"
- "evaluate decision"

## Steps

### 1. Capture the Proposal

Work with the user to capture:

- **Decision statement**: what is being proposed
- **Context**: why this decision is being considered
- **Options considered**: alternatives that were evaluated
- **Expected impact**: what changes if this is accepted

If the user provides a partial proposal, ask clarifying questions to
complete it.

### 2. Load Existing Decisions

Read the full set of accepted decisions:

- `docs/decisions/README.md` — index of all ADRs
- All individual ADR files in `docs/decisions/`
- `.ai/decisions/` — agent-oriented summaries
- `docs/architecture/*.md` — architecture documents that may be affected

### 3. Dispatch Focused Agents

Dispatch a subset of agents focused on decision evaluation:

| Agent                 | Analysis                                                                              |
| --------------------- | ------------------------------------------------------------------------------------- |
| architecture-guardian | Does this contradict any existing ADR? Does it cohere with the architecture?          |
| simplicity-guardian   | Is this abstraction justified? Is there a simpler approach?                           |
| docs-guardian         | Which documents would need updating? Is the scope of documentation change reasonable? |
| consistency-reviewer  | Does this decision establish a new pattern? Is it consistent with existing patterns?  |

### 4. Conflict Analysis

Specifically check for:

- **Direct contradictions**: does this decision reverse a previous one?
- **Implicit contradictions**: does this decision make a previous decision
  harder to follow?
- **Scope expansion**: does this decision expand the scope of the project
  beyond its stated vision?
- **Complexity accumulation**: does this add to the growing list of
  patterns without removing any?

### 5. Produce Recommendation

```text
## Decision Review

### Proposal
<the captured proposal>

### Conflict Analysis
- Conflicts found: <list or "none">
- Implicit contradictions: <list or "none">

### Agent Findings
<consolidated findings from dispatched agents>

### Recommendation
- [ACCEPT|ACCEPT_WITH_MODIFICATIONS|REJECT|DEFER]
  <reasoning>

### If Accepted
- Documents to update: <list>
- ADR to create: <suggested ADR title>
- Impact scope: <what areas of the codebase are affected>
```

### 6. Present to User

Display the recommendation. If ACCEPT_WITH_MODIFICATIONS, include the
specific modifications suggested. Do not create the ADR — that is a human
decision.

## Expected Duration

Moderate. Focused analysis on decision coherence rather than full codebase
scanning.

## Output

A decision evaluation with conflict analysis and recommendation.
