# Workflow: Review Change

Review current uncommitted changes or recent commits. Targeted analysis
of specific modifications rather than a full repository audit.

## Trigger

- "review change"
- "review my changes"
- "construction review"
- "review"

## Steps

### 1. Gather Change Scope

Determine what to review:

1. Check for uncommitted changes: `git status`
2. If uncommitted changes exist, get the diff:
   - `git diff` (unstaged)
   - `git diff --cached` (staged)
3. If no uncommitted changes, review recent commits:
   - `git diff HEAD~3..HEAD` (last 3 commits)
   - Or review a specific commit/branch if specified
4. List all affected files from the diff

### 2. Classify the Change

Analyze the diff to classify the change type:

| Signal                                         | Classification   |
| ---------------------------------------------- | ---------------- |
| ADR, `docs/decisions/`, boundary config        | `architectural`  |
| New feature code in `libs/domains/` or `apps/` | `feature`        |
| Only `.md` files changed                       | `documentation`  |
| `tools/`, `nx.json`, `eslint.config.*`, CI     | `tooling`        |
| Code restructuring, no behavior change         | `refactor`       |
| Test files, lint config, type improvements     | `quality`        |
| Provider, config, infrastructure code          | `infrastructure` |

### 3. Dispatch Relevant Agents

Load the orchestrator from `.construction/agents/orchestrator.md`.

Use the dispatch matrix to determine which agents to invoke. Provide each
agent with:

- The full diff of changes
- List of affected files
- The classification of the change
- Relevant architecture context for their domain

### 4. Consolidate Findings

Follow the orchestrator's Phase 3 consolidation process:

1. Collect all agent findings
2. Detect inter-agent conflicts
3. Classify as BLOCKER / WARNING / SUGGESTION
4. Generate targeted report

### 5. Present to User

Display the review report scoped to the specific changes. Do not apply
any changes. Let the user decide which findings to act on.

## Expected Duration

Faster than inspect-repository. Only relevant agents are dispatched,
focused on the specific changes.

## Output

A targeted review of the specific changes with actionable findings.
