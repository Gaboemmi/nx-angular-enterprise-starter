# Construction Harness

Temporary engineering layer used to design, audit, harden, and order the
Angular Enterprise Starter while it is being built. This directory is **not
part of the delivered product** and will be deleted before release.

## Separation

```text
CONSTRUCTION HARNESS              PRODUCT HARNESS
(.construction/)                  (.ai/, AGENTS.md)

Temporal                          Permanent
Helps US build the starter        Helps the USER who downloads the starter
Detects, recommends, validates    Guides feature development
Deleted before release            Lives in the repository
```

The Construction Harness observes the product. The product does not know the
Construction Harness exists. Nothing inside `apps/`, `libs/`, `core/`,
`shared/`, or `features/` imports or depends on this directory.

## Usage

Invoke via the `construction-orchestrator` skill:

| Command                          | Workflow                     |
| -------------------------------- | ---------------------------- |
| `construction audit`             | Full repository inspection   |
| `construction review`            | Review current changes       |
| `construction decide <proposal>` | Evaluate a proposed decision |
| `construction consolidate`       | Post-implementation review   |
| `construction harden`            | Pre-release hardening sweep  |

## Agents

| Agent                 | Mission                                               |
| --------------------- | ----------------------------------------------------- |
| orchestrator          | Coordinates specialist agents based on change scope   |
| architecture-guardian | Architectural coherence with existing decisions       |
| clean-code-reviewer   | Code quality as exemplar for starter users            |
| angular-expert        | Modern Angular patterns, not legacy disguised         |
| harness-architect     | Maintain the future Product Harness for end users     |
| docs-guardian         | Detect documentation/implementation drift             |
| simplicity-guardian   | Prevent over-engineering, enforce YAGNI               |
| consistency-reviewer  | One recommended way per pattern across the repository |

## Nuclear Rules

1. **Agents never invent architecture.** They detect, compare, question,
   recommend, and validate. Architectural decisions remain human decisions.
2. **`ARCHITECTURAL DECISION REQUIRED`** halts the workflow. No agent may
   proceed past this signal without explicit human direction.
3. **Agents never modify code.** Findings are reported as recommendations.
   Corrections are applied only after human review.
4. **Agents reference construction-principles.md** as their foundational
   rule set.

## Lifecycle

```text
CREATED ──► USED ──► CONSTRUCTION FREEZE ──► DELETED
```

When Angular Enterprise reaches `1.0` readiness, run the `harden` workflow
to produce a final audit. Then remove `.construction/` entirely. The
repository will contain only the product code, architecture documentation,
and the Product Harness (`AGENTS.md`, `.ai/`, `.opencode/`).
