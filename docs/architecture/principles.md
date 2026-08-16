# Engineering Principles

This document defines the engineering principles that guide `nx-angular-enterprise-starter`.

These principles are intentionally more stable than individual technologies, libraries, or implementation patterns.

They should help answer a simple question whenever multiple solutions are possible:

> Which solution best fits the architecture of this project?

Detailed implementation rules belong in architecture documentation, ADRs, specifications, and automated constraints.

---

## 1. Prefer Simplicity

Choose the simplest solution that preserves the architectural qualities the system needs.

Do not introduce abstractions, layers, libraries, patterns, or infrastructure without a concrete reason.

Enterprise software requires structure.

It does not require unnecessary ceremony.

Every abstraction should solve an identifiable problem such as:

- protecting a boundary,
- isolating infrastructure,
- expressing domain behavior,
- improving testability,
- reducing coupling,
- enabling replacement,
- or making intent clearer.

If an abstraction does not provide meaningful value, it should not exist.

---

## 2. Architecture Must Be Explicit

Developers should not need tribal knowledge to understand how the application is structured.

Important concepts should be visible through:

- project structure,
- naming,
- dependency direction,
- public APIs,
- documentation,
- tests,
- and automated architectural constraints.

A developer should be able to understand where code belongs and what it may depend on without reverse-engineering the entire repository.

---

## 3. Organize Around Business Capabilities

Business code should primarily be organized around domains and capabilities rather than technical categories.

Prefer:

```text
domains/
  incidents/
  planning/
  operations/
```

over architectures dominated by global technical folders such as:

```text
components/
services/
models/
utils/
```

Technical concerns still exist, but they should not define the primary structure of the business application.

Code that changes together should generally live together.

---

## 4. Boundaries Matter More Than Layers

Layers are useful only when they protect meaningful responsibilities.

We use architectural concepts such as domain, application, infrastructure, and presentation when they improve separation and dependency direction.

We do not require every feature to contain every possible architectural layer.

A simple feature should remain simple.

A complex domain should be allowed to develop stronger internal boundaries.

Architecture should scale with complexity rather than impose maximum complexity from day one.

---

## 5. Dependencies Point Toward Stable Concepts

Business rules should not depend directly on volatile infrastructure.

Domain and application logic should remain as independent as reasonably possible from:

- HTTP clients,
- authentication SDKs,
- browser APIs,
- persistence technologies,
- localization providers,
- analytics systems,
- and other external infrastructure.

Infrastructure adapts to the application.

The application should not be designed around infrastructure.

---

## 6. Use Abstractions at Real Boundaries

Not everything needs an interface, adapter, facade, mapper, repository, or use case.

Introduce these patterns where they protect a real architectural boundary or express an important responsibility.

For example, isolating an authentication provider behind an application contract can provide meaningful portability.

Creating an interface around a trivial internal function usually does not.

Abstraction is a tool.

It is not a goal.

---

## 7. Features Own Their Business Logic

Business behavior should belong to the domain or feature that owns it.

Avoid global dumping grounds such as generic:

- `utils`,
- `helpers`,
- `common`,
- `services`,
- or `shared`

for code that actually represents domain behavior.

Shared code should be genuinely domain-independent or intentionally shared through an explicit contract.

A feature should expose the smallest public API necessary for other parts of the system.

Its internal implementation should remain private.

---

## 8. Shared Is Not a Business Domain

`shared` exists to support reusable, domain-independent capabilities.

It must not become a place where code is moved simply because multiple features currently use it.

Duplication is sometimes cheaper than creating the wrong abstraction.

Promote something to shared only when its shared responsibility is clear and stable.

---

## 9. Core Infrastructure Can Be Pragmatic

Business features require strong boundaries because business complexity grows quickly.

Foundation and infrastructure code may use simpler structures when additional layering would provide little value.

Architectural consistency does not mean applying identical rules to every part of the repository.

Strictness should be proportional to architectural risk.

---

## 10. Modular Monolith by Default

The default architecture is a modular Nx monolith.

Applications are composed from strongly isolated domains and features with explicit dependency boundaries.

Modules should be independently understandable and sufficiently isolated that deployment boundaries can evolve later if necessary.

Microfrontends and Module Federation are deployment strategies, not domain architecture.

Therefore the project follows:

> Federation-ready, not federation-first.

No feature should depend conceptually on Module Federation to function correctly.

---

## 11. Prefer Contracts Over Knowledge

Modules should communicate through explicit contracts rather than knowledge of each other's internals.

The same principle applies across system boundaries.

Frontend/backend integration should prefer explicit, machine-readable contracts whenever practical.

Contracts reduce ambiguity for:

- developers,
- tests,
- tooling,
- code generation,
- and AI agents.

Hidden assumptions are architectural debt.

---

## 12. Keep Transport Models Away From the Domain

Backend DTOs, generated API models, persistence structures, and external provider representations are not automatically domain models.

Transform external representations when the distinction protects the domain from transport or infrastructure concerns.

Do not create mappings mechanically when both representations are genuinely identical and no boundary is being protected.

Mapping should communicate a boundary, not satisfy a ritual.

---

## 13. State Has an Owner

Every piece of state should have a clear owner.

Prefer the narrowest appropriate scope:

1. component-local state,
2. feature state,
3. application-wide state.

Do not promote state globally merely because multiple components need access to it.

Derived state should normally be computed rather than independently stored.

The architecture should make state flow predictable and understandable.

---

## 14. Let Angular Define Angular

Use the official Angular Agent Skill for framework conventions. This repository
does not maintain duplicate rules for component APIs, reactivity, dependency
injection, templates, modules, or change detection. Its architecture defines
only the boundaries and ownership that Angular cannot infer.

---

## 15. Prefer the Platform Before Adding Abstractions

Use semantic HTML and browser capabilities whenever they solve the problem correctly.

Prefer native elements and semantics before introducing custom components.

Accessibility should be designed into components rather than added afterward.

Framework or CDK abstractions should be used when they provide meaningful behavior that the platform alone does not conveniently provide.

---

## 16. The Design System Is a Contract

Applications should consume the project's design system instead of independently implementing common visual patterns.

The design system owns reusable UI behavior, accessibility patterns, visual tokens, and common interaction primitives.

Applications own product and domain composition.

Infrastructure libraries used internally by the design system should not unnecessarily leak into application features.

The design system should reduce UI inconsistency without becoming a generic abstraction over HTML.

---

## 17. Internationalization Is Not Localization

Text translation is only one part of internationalization.

Applications must account for locale-sensitive behavior such as:

- language,
- date formats,
- time formats,
- number formats,
- currencies,
- and regional variations.

Language and locale should not be treated as interchangeable concepts.

Localization concerns should be modeled intentionally instead of being scattered across components.

---

## 18. Time Must Have Clear Semantics

Dates and times should represent their actual business meaning.

An instant in time, a calendar date, and a local wall-clock time are different concepts and should not be accidentally treated as equivalent.

For absolute events, backend systems should exchange canonical instants and the UI should present them in the appropriate user context.

Timezone transformations should be centralized and intentional.

Components should not contain arbitrary timezone-shifting logic.

---

## 19. Runtime Configuration Is Not Build Configuration

Values that can differ between deployments should not require rebuilding the application when runtime configuration is sufficient.

Applications should clearly distinguish:

- compile-time configuration,
- runtime environment configuration,
- user preferences,
- and business configuration.

Configuration should have an explicit owner and lifecycle.

---

## 20. Authentication Providers Are Infrastructure

The application should understand authentication concepts such as:

- authenticated identity,
- session,
- permissions,
- authentication state,
- and logout.

It should not require business features to understand the SDK of the selected authentication provider.

Provider-specific behavior belongs behind infrastructure boundaries.

Replacing an authentication provider should not require redesigning business features.

---

## 21. Authorization Must Be Enforced at the Correct Boundary

Frontend authorization improves user experience but is not a security boundary.

The frontend may decide whether to expose actions or routes based on permissions.

The backend remains responsible for enforcing security-sensitive authorization.

Never treat hidden UI as access control.

---

## 22. Errors Are Part of the Application Model

Failures should not be handled independently and inconsistently throughout the UI.

Different failure categories may require different strategies:

- expected domain failures,
- validation failures,
- authentication failures,
- authorization failures,
- network failures,
- and unexpected application errors.

Infrastructure errors should be translated into meaningful application concepts when appropriate.

Users should receive useful feedback without exposing unnecessary technical details.

---

## 23. Testing Protects Behavior and Architecture

Tests should provide confidence, not merely increase coverage metrics.

Prioritize testing:

- business behavior,
- important transformations,
- architectural contracts,
- edge cases,
- regressions,
- and critical user flows.

Implementation details should not be tested unnecessarily.

Tests should support refactoring rather than prevent it.

---

## 24. Architecture Should Be Executable

Important architectural rules should be automated whenever reasonably possible.

Examples include:

- dependency boundaries,
- forbidden imports,
- project relationships,
- public APIs,
- linting,
- type safety,
- tests,
- builds,
- and contract validation.

Documentation explains architecture.

Tooling protects it.

A rule that matters enough to repeatedly review manually should be considered for automated enforcement.

---

## 25. Type Safety Is an Architectural Tool

TypeScript's type system should be used to make invalid states harder to represent and contracts easier to understand.

Avoid weakening types for convenience.

Prefer:

- explicit domain types,
- discriminated unions,
- narrow interfaces,
- generated API contracts where appropriate,
- and strict compiler settings.

Use `any` only when there is a deliberate and documented reason.

Types should communicate intent, not merely satisfy the compiler.

---

## 26. Generated Code Is Infrastructure

Code generated from external contracts should be treated as generated infrastructure.

Do not manually modify generated files.

Generated APIs should not dictate the architecture of the rest of the application.

Application-facing abstractions may adapt generated clients when doing so protects a meaningful boundary.

---

## 27. Optimize for Change

Enterprise applications live for years.

Architecture should therefore optimize not only for today's implementation speed but for the cost of future change.

Prefer designs where changing one concern does not require understanding or modifying unrelated concerns.

Good modularity limits the blast radius of change.

---

## 28. Prefer Evolutionary Architecture

We should not design hypothetical infrastructure for problems we do not yet have.

Instead, establish boundaries that allow the architecture to evolve safely.

Examples include:

- modular monolith → optional federation,
- authentication contract → different providers,
- API contract → regenerated clients,
- local feature state → richer state management when complexity requires it.

Prepare for evolution without implementing every possible future.

---

## 29. Documentation Must Earn Its Maintenance Cost

Documentation should exist when it preserves knowledge that cannot be expressed more effectively through code, types, tests, or automated rules.

Avoid documentation that simply repeats the implementation.

The project uses different artifacts for different purposes:

- **Vision** — why the project exists.
- **Principles** — how engineering decisions are evaluated.
- **Architecture docs** — how the system is structured.
- **ADRs** — why important architectural decisions were made.
- **Specs** — what a concrete change must accomplish.
- **Tests** — what behavior is verified.
- **Code** — what the system actually does.

Documentation should be concise enough to remain useful and maintained.

---

## 30. AI Context Should Be Structured, Not Huge

AI agents should receive the minimum context necessary to make a correct change.

Do not solve AI reliability by continuously increasing prompt size.

Prefer structured repository knowledge:

- concise project instructions,
- architecture documentation,
- local context,
- specifications,
- examples,
- tests,
- executable constraints,
- and focused skills or workflows.

Context should be relevant to the task.

More context is not automatically better context.

---

## 31. AI Must Operate Inside the Engineering System

AI-generated code is held to the same engineering standards as human-generated code.

AI does not bypass:

- architectural boundaries,
- tests,
- type safety,
- linting,
- code review,
- specifications,
- or validation.

The repository should make correct implementation easier for AI by making expectations explicit and machine-verifiable.

> AI should not replace engineering. AI should accelerate engineering.

---

## 32. Prefer Deterministic Validation Over Instructions

Whenever possible, replace:

> "Remember to do X."

with:

> "The repository verifies X."

Instructions are useful.

Automated feedback is stronger.

The more important a rule becomes, the more valuable it is to encode that rule into tooling, tests, or architecture constraints.

This principle applies equally to humans and AI agents.

---

## 33. Optimize Developer Experience Without Hiding Architecture

Common tasks should be easy to perform.

Generators, automation, templates, and tooling are encouraged when they reduce repetitive work and guide developers toward correct patterns.

However, developer experience should not hide important architectural concepts behind excessive magic.

Developers should still be able to understand what the tooling creates and why.

---

## 34. Prefer Consistency Over Personal Preference

Once the project establishes a reasonable pattern, contributors should normally follow it unless there is a concrete reason to change it.

A slightly less preferred solution used consistently across the repository is often better than several individually preferred solutions solving the same problem differently.

When a better pattern is identified, evolve the architecture intentionally rather than introducing parallel conventions.

---

## 35. Decisions Should Be Reversible When Possible

Avoid unnecessarily locking the application into infrastructure choices.

Prefer designs where technology decisions can evolve without rewriting unrelated business code.

Not every dependency needs abstraction.

But expensive, volatile, or externally controlled dependencies deserve deliberate boundaries.

---

## 36. No Pattern Is Sacred

DDD, Clean Architecture, Hexagonal Architecture, CQRS, Facades, Use Cases, Mappers, Stores, Repositories, and other patterns are tools.

The project may use ideas from several architectural approaches.

None of them defines the project.

We adopt patterns because they solve problems in our context.

We remove or simplify them when they no longer do.

The architecture serves the application.

The application does not serve the architecture.

---

# Decision Heuristic

When evaluating a new architectural decision, prefer the solution that:

1. is easier to understand,
2. preserves domain boundaries,
3. minimizes coupling,
4. makes dependencies explicit,
5. keeps infrastructure replaceable where replacement matters,
6. can be tested effectively,
7. can be enforced automatically when important,
8. follows modern Angular without unnecessary novelty,
9. provides useful context to both developers and AI,
10. and introduces the least complexity necessary to achieve the above.

When two solutions satisfy these goals equally well:

**choose the simpler one.**
