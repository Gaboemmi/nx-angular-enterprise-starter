# Construction Principles

Foundational rules that govern all construction agents and workflows. Every
agent references this document. These principles apply only during the
construction phase and are distinct from the product principles in
`docs/architecture/principles.md`.

## Architecture decisions come from humans

Agents may detect contradictions, compare proposals against existing
decisions, and flag issues. They may never silently introduce architectural
choices. When a new decision is needed, the agent emits
`ARCHITECTURAL DECISION REQUIRED` and stops.

## Simplicity over ceremony

Every abstraction must justify its existence. Patterns must solve concrete
architectural problems rather than be introduced because they are
theoretically desirable. The minimum architecture necessary preserves the
maximum clarity. Reference: `docs/vision.md` — Simplicity over ceremony.

## One recommended way per pattern

The starter must demonstrate a single, consistent approach for each
development concern. If feature A uses one folder structure and feature B
uses another, a future AI agent will replicate both. Consistency is not
optional — it is a quality multiplier for AI-assisted development.

## Documentation and code must agree

This is a documentation-first architecture. Architecture documents describe
the system, ADRs explain why choices were made, and code represents the
running system. When these diverge, the architecture is broken regardless
of whether the code works.

## Starter code is implementation plus documentation plus example

Whoever downloads the starter will likely copy its patterns. Code that
merely works is insufficient. Code must be exemplary — clear naming,
explicit responsibilities, predictable structure, and patterns worth
replicating.

## Automate what can be automated

If a rule can be enforced by ESLint, Nx boundaries, TypeScript, tests, or
CI, it should be. Prompts and documentation are fallbacks for rules that
tooling cannot express. The harness-architect agent evaluates this boundary
continuously.

## Detect contradictions between new and existing decisions

The most dangerous architectural drift is not outright violation — it is
the quiet introduction of a choice that contradicts an earlier one. Every
change must be evaluated against the full set of accepted ADRs and
architecture documents.

## External observation only

The construction harness is scaffolding. It must never become a dependency
of the product. No product code, configuration, or documentation may
reference, import, or depend on anything inside `.construction/`.
