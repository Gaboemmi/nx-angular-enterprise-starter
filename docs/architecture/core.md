# Core DDD Primitives

`core/` contains domain-independent primitives that have demonstrated a stable
common contract across multiple features. It is shared infrastructure, not a
home for business logic or a collection of abstractions created in advance.

```text
core/
└── ddd/
    ├── mapper.service.ts
    ├── async-mapper.service.ts
    └── use-case.service.ts
```

## Mapper service

Mappers translate between representations, most commonly an API DTO and a
domain model.

```ts
export abstract class MapperService<From, To> {
  abstract transform(input: From): To;

  transformArray(inputs: From[]): To[] {
    return inputs.map((input) => this.transform(input));
  }
}
```

An asynchronous variant may return `Promise<To>`. Feature mappers extend these
classes only when the mapping boundary is meaningful; do not add identity
mappers mechanically.

## Use-case service

Use cases express application intent and coordinate domain behaviour.

```ts
export abstract class UseCaseService<Params, Result> {
  abstract execute(params: Params): Promise<Result>;
}
```

A use case may coordinate domain objects, repositories or ports, authorization
rules and application workflows. Do not create one merely to delegate a trivial
operation without application semantics.

## State management

Feature stores remain feature-owned by default. Do not add a generic store base
class to `core/` until concrete features establish a stable common contract.
See [State management](./state-management.md) for state ownership, Signals,
Router state and server-data guidance.

## Constraints

- Keep `core/` framework-independent TypeScript wherever possible.
- Do not place business rules or domain models in `core/`.
- Promote a primitive only when its shared responsibility is clear and stable.

## Related documentation

- [Domain-Driven Design](./ddd.md)
- [State management](./state-management.md)
- [Principles](./principles.md)
- [ADR-002 — Domain-Driven Modular Architecture](../decisions/ADR-002-domain-driven-architecture.md)
