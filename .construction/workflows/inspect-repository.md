# Workflow: Inspect Repository

Full repository audit. Evaluates the entire Angular Enterprise Starter
against all construction principles, architectural decisions, and quality
standards.

## Trigger

- "inspect repository"
- "full audit"
- "repo health check"
- "construction audit"

## Steps

### 1. Load Context

Read the following before dispatching agents:

- `.construction/knowledge/construction-principles.md`
- `.ai/architecture.md`
- `docs/vision.md`
- `docs/decisions/README.md` (list all ADRs)
- `docs/architecture/principles.md`

### 2. Survey Repository

Gather the current state:

- List all projects: `npx nx show projects`
- List all libraries under `libs/`
- List all features under `libs/domains/` if they exist
- Check `tools/generators/` for implemented generators
- Check `.ai/skills/` for existing skills
- Check `.ai/decisions/` for agent-facing decisions
- List all `docs/architecture/` files
- List all `docs/decisions/` ADRs

### 3. Dispatch All Agents

Load the orchestrator from `.construction/agents/orchestrator.md`.

Dispatch **all eight** specialist agents with full repository context:

| Agent                      | Context to Provide                               |
| -------------------------- | ------------------------------------------------ |
| architecture-guardian      | Full architecture docs, all ADRs, repo structure |
| boundary-enforcement-agent | Enforcement config, ESLint, generators, CI, tags |
| clean-code-reviewer        | All source code in libs/ and apps/app/           |
| angular-expert             | All component, service, and template files       |
| harness-architect          | .ai/, .opencode/, .agents/, AGENTS.md            |
| docs-guardian              | All docs/ files, all .ai/ files, code references |
| simplicity-guardian        | Full repository overview, all abstractions       |
| consistency-reviewer       | Full repository overview, all patterns           |

### 4. Consolidate Findings

Follow the orchestrator's Phase 3 consolidation process:

1. Collect all agent findings
2. Detect inter-agent conflicts
3. Classify as BLOCKER / WARNING / SUGGESTION
4. Generate consolidated report

### 5. Generate Report

Produce the full Construction Review Report with:

- **Summary**: scope, agents dispatched, finding counts
- **Blockers**: must be resolved before proceeding
- **Warnings**: should be addressed soon
- **Suggestions**: improvement opportunities
- **Architectural Decisions Required**: if any agent stopped the flow
- **Agent Conflicts**: if agents disagree
- **Health Score**: overall assessment (HEALTHY / NEEDS ATTENTION / AT RISK)

### 6. Present to User

Display the consolidated report. Do not apply any changes. Let the user
decide which findings to act on.

## Expected Duration

This is the most comprehensive workflow. It dispatches all agents and
analyzes the full repository. Expect it to take longer than targeted
reviews.

## Output

A comprehensive health report that can serve as a baseline for measuring
progress toward `1.0` readiness.
