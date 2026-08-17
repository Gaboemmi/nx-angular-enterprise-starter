# Workflow: Harden Repository

Pre-release hardening sweep. Comprehensive audit designed to assess
readiness for `CONSTRUCTION FREEZE` and eventual deletion of the
construction harness.

## Trigger

- "harden repository"
- "pre-release audit"
- "final audit"
- "construction harden"
- "freeze"

## Steps

### 1. Full Repository Dispatch

Dispatch **all seven** specialist agents with full context. This is the
most comprehensive review — it evaluates the entire repository against
every standard.

| Agent                 | Hardening Focus                                                               |
| --------------------- | ----------------------------------------------------------------------------- |
| architecture-guardian | All ADRs are implemented, all boundaries are enforced, no architectural drift |
| clean-code-reviewer   | All code is exemplary, no shortcuts, no technical debt                        |
| angular-expert        | All Angular patterns are modern throughout                                    |
| harness-architect     | Product Harness is complete, accurate, and minimal                            |
| docs-guardian         | All documentation is current, no drift, all links valid                       |
| simplicity-guardian   | No unnecessary abstractions, no over-engineering                              |
| consistency-reviewer  | One way per pattern, no inconsistencies                                       |

### 2. Mechanical Validation

Run all validation commands (per `.ai/validation.md`):

```bash
npm run format
npx nx run-many --target=lint
npx nx run-many --target=test
npx nx run-many --target=build
```

Report any failures as BLOCKERs.

### 3. ADR Completeness Check

For each `docs/decisions/` ADR:

- Is the decision actually implemented in code?
- Is the implementation consistent with what the ADR describes?
- Are there any ADRs that are outdated or superseded?

### 4. Documentation Completeness Check

For each `docs/architecture/` document:

- Does the described architecture match the actual code?
- Are all referenced files and patterns current?
- Is there any documentation that describes features not yet implemented
  (or features that were removed)?

### 5. Product Harness Audit

Evaluate the completeness of the product harness for end users:

- `AGENTS.md` — is it clear and complete?
- `.ai/architecture.md` — is it an accurate map?
- `.ai/skills/` — do all skills reflect current patterns?
- `.ai/decisions/` — are all summaries accurate?
- `.opencode/` — are skills discoverable and current?
- `.agents/` — are shared skills in sync?

### 6. Freeze Readiness Assessment

Produce a readiness checklist:

```text
## Construction Freeze Readiness

### Architecture
- [ ] All ADRs implemented consistently
- [ ] No architectural drift detected
- [ ] All boundaries enforced by tooling

### Code Quality
- [ ] All code is exemplary for a starter
- [ ] No UNACCEPTABLE findings from clean-code-reviewer
- [ ] No OUTDATED patterns from angular-expert

### Documentation
- [ ] All docs match implementation
- [ ] No drift detected by docs-guardian
- [ ] All cross-references valid

### Product Harness
- [ ] AGENTS.md accurate and complete
- [ ] All skills current
- [ ] All decisions documented
- [ ] Agent-neutral skills in sync

### Simplicity
- [ ] No unnecessary abstractions
- [ ] No REJECT findings from simplicity-guardian

### Consistency
- [ ] One way per pattern established
- [ ] No INCONSISTENT findings

### Mechanical
- [ ] Lint passes
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Formatting applied

### VERDICT
- [ ] READY FOR CONSTRUCTION FREEZE
- [ ] NOT READY — remaining items listed below
```

### 7. Present to User

Display the full hardening report with the freeze readiness assessment.
The user decides whether to proceed with construction freeze.

If READY: the user can delete `.construction/` and proceed to release.
If NOT READY: list the specific remaining items that need attention.

## Expected Duration

This is the longest and most comprehensive workflow. It evaluates
everything.

## Output

A comprehensive hardening report with a clear freeze readiness verdict.
