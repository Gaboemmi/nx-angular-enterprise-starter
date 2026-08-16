# Core DDD Primitives

`core/` contains domain-independent primitives that have demonstrated a stable
common contract across multiple features. It is shared infrastructure, not a
home for business logic or a collection of abstractions created in advance.

```text
libs/core/ddd/
└── src/
    ├── index.ts
    └── lib/
        ├── mapper.ts
        └── use-case.ts
```

## Mapper

Mappers translate between representations, most commonly an API DTO and a
domain model.

```ts
export abstract class Mapper<From, To> {
  abstract map(source: From): To;

  mapArray(sources: readonly From[]): To[] {
    return sources.map((source) => this.map(source));
  }
}
```

Feature mappers extend this class only when the mapping boundary is meaningful;
do not add identity mappers mechanically. Mappers are synchronous: asynchronous
work belongs in a repository, datasource, or use case, not a transformation.

## Use case

Use cases express application intent and coordinate domain behaviour.

```ts
export interface UseCase<Input, Output> {
  execute(input: Input): Output;
}
```

A use case may coordinate domain objects, repositories or ports, authorization
rules and application workflows. `Output` may be a synchronous value, a
`Promise`, or an `Observable`; the core contract deliberately does not choose
an asynchronous abstraction. Do not create one merely to delegate a trivial
operation without application semantics.

Use the public API from `@nx-angular-enterprise-starter/core/ddd`. Invoke use
cases directly with `useCase.execute(input)` and mappers with `mapper.map(value)`
or `mapper.mapArray(values)`. The core does not provide a generic executor or
mapper service because neither has a cross-cutting responsibility yet.

## State management

Feature stores remain feature-owned by default. Do not add a generic store base
class to `core/` until concrete features establish a stable common contract.
See [State management](./state-management.md) for state ownership, Router state
and server-data guidance.

## Constraints

- Keep `core/` framework-independent TypeScript wherever possible.
- Do not place business rules or domain models in `core/`.
- Promote a primitive only when its shared responsibility is clear and stable.

## Related documentation

- [Domain-Driven Design](./ddd.md)
- [State management](./state-management.md)
- [Principles](./principles.md)
- [ADR-002 — Domain-Driven Modular Architecture](../decisions/ADR-002-domain-driven-architecture.md)
