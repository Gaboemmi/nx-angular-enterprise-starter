# Domain-Driven Design

Business code is organized as vertical slices: a bounded context is the
vertical, and its domain, application, infrastructure, and presentation
responsibilities are internal layers. Layers are not global technical folders
and are not mandatory Nx libraries; introduce library boundaries only when they
protect a meaningful responsibility.

This project uses **Domain-Driven Design (DDD) as an architectural guide**, combined with principles from Clean Architecture and Hexagonal Architecture.

The goal is not to implement every DDD pattern everywhere.

The goal is to create clear domain boundaries, keep business logic independent from frameworks and infrastructure, and make the architecture predictable for both **developers and AI-assisted development tools**.

> Patterns are tools, not mandatory layers.

---

## 1. Core Principles

### Domain first

Business concepts should be expressed using the language of the domain.

Prefer:

```ts
trip.release();
incident.resolve();
assignment.cancel();
```

over infrastructure-oriented abstractions leaking into business code.

### Dependency direction

Dependencies should point toward the domain.

```text
Presentation
     │
     ▼
Application
     │
     ▼
Domain
     ▲
     │
Infrastructure
```

The domain must not depend on:

- Angular
- HTTP
- APIs
- storage
- UI frameworks
- state-management libraries
- infrastructure DTOs

### Explicit boundaries

Features should expose a deliberate public API.

Internal implementation details should not become dependencies of other domains or features.

Nx boundaries and architecture enforcement tools should enforce these rules wherever practical.

### Pragmatism over ceremony

DDD patterns are introduced when they solve a real architectural problem.

Do not create abstractions solely because a diagram contains them.

A simple feature should remain simple.

---

# 2. Architectural Layers

A business domain may contain four conceptual areas:

```text
domain/
application/
infrastructure/
presentation/
```

These are **responsibilities**, not mandatory folders.

The physical Nx structure may group or split them depending on the size and complexity of the domain.

The shared core library provides the stable `UseCase<Input, Output>` and
`Mapper<From, To>` contracts. Features use `execute(input)`, `map(value)`, and
`mapArray(values)` directly; it intentionally has no generic executor or mapper
service. See [Core DDD primitives](./core.md).
State-management ownership and feature-store guidance live in
[State management](./state-management.md).

## Domain

Contains business concepts and rules.

Typical elements:

```text
domain/
├── entities/
├── value-objects/
├── models/
├── ports/
└── services/
```

The domain should contain framework-independent TypeScript whenever possible.

Examples:

```ts
export interface TripRepository {
  getById(id: TripId): Promise<Trip>;
}
```

```ts
export class Trip {
  release(): void {
    // domain rule
  }
}
```

The domain does not know whether data comes from REST, GraphQL, local storage, IndexedDB, or another source.

### Model ownership

Every business model has one bounded-context owner. Reuse is justified by the
same language, rules and lifecycle, not merely because two contexts refer to
the same real-world concept or currently expose the same properties.

For example, Catalog may own a `Product` while Inventory owns a `StockItem` that
also contains a `productId`. They may evolve independently. Do not merge them
into a global model with optional catalog and inventory fields just to remove
small duplication.

Share a model only as a deliberate cross-context contract, or share a primitive
whose meaning is genuinely stable across contexts. Otherwise, keep the models
separate and translate at the boundary when information crosses contexts.

---

## Application

Contains application behavior and orchestration.

Typical elements:

```text
application/
├── use-cases/
└── services/
```

Use Cases describe operations the application can perform.

Examples:

```text
GetTrips
CreateTrip
ReleaseTrip
AssignVehicle
ResolveIncident
```

A Use Case may coordinate:

- domain objects
- repositories/ports
- authorization rules
- multiple operations
- application workflows

Example:

```ts
export class ReleaseTripUseCase implements UseCase<TripId, Promise<void>> {
  constructor(private readonly trips: TripRepository) {}

  async execute(id: TripId): Promise<void> {
    const trip = await this.trips.getById(id);

    trip.release();

    await this.trips.save(trip);
  }
}
```

Use Cases should express **application intent**, not HTTP operations.

Prefer:

```text
ReleaseTrip
```

over:

```text
PostTripReleaseRequest
```

### When to create a Use Case

Create one when the operation:

- represents meaningful application behavior;
- contains or coordinates business rules;
- coordinates multiple dependencies;
- is reusable from different entry points;
- benefits from isolated testing.

Do not introduce a Use Case merely to delegate a trivial operation without adding application semantics.

---

# 3. Ports and Repositories

The application/domain should depend on abstractions rather than concrete infrastructure when decoupling provides value.

Example:

```ts
export interface TripRepository {
  getAll(): Promise<Trip[]>;
  getById(id: TripId): Promise<Trip>;
  save(trip: Trip): Promise<void>;
}
```

Infrastructure provides the implementation:

```ts
export class ApiTripRepository implements TripRepository {
  // ...
}
```

This allows the application to depend on:

```text
TripRepository
```

instead of:

```text
HttpClient
```

Repositories should represent domain-oriented data access.

Avoid repositories that merely rename HTTP endpoints without providing a meaningful abstraction.

---

# 4. Datasources

Datasources communicate with external systems.

Examples include:

- REST APIs
- GraphQL
- browser storage
- IndexedDB
- external SDKs

Example:

```ts
export class TripApiDatasource {
  getTrips(): Observable<TripDto[]> {
    // HTTP implementation
  }
}
```

Datasources belong to infrastructure.

They understand transport concerns such as:

```text
URLs
HTTP methods
query parameters
DTOs
headers
serialization
```

They should not contain business rules.

---

# 5. Mappers

Mappers translate between representations.

The most common case is:

```text
API DTO
   │
   ▼
Mapper
   │
   ▼
Domain Model
```

and, when required:

```text
Domain Model
   │
   ▼
Mapper
   │
   ▼
Request DTO
```

Example:

```ts
export class TripDtoToTripMapper extends Mapper<TripDto, Trip> {
  map(dto: TripDto): Trip {
    return new Trip({
      id: dto.id,
      name: dto.trip_name,
    });
  }
}
```

This prevents infrastructure models from leaking into the domain.

### When to create a Mapper

Use a mapper when representations differ meaningfully.

Do not create identity mappers such as:

```ts
map(dto: CountryDto): Country {
  return dto;
}
```

unless the separation protects an intentional architectural boundary.

### Representation-specific models

An API DTO, domain model, application model and presentation view model are
different responsibilities, not four artifacts that every flow must contain.
Keep separate representations when their language, lifecycle, validation or
consumer needs differ. Collapse them when the distinction adds no value, and do
not introduce identity mappings as ceremony.

---

# 6. Store

Stores manage feature-level client-side state. See [State management](./state-management.md)
for ownership, Router state, server state and lifecycle guidance.

They are **not part of DDD itself**.

They belong to the frontend architecture and use the reactivity approach selected
for the implementation by the Angular Agent Skill.

A Store may manage:

```text
entities
loading state
selection
filters
pagination
errors
derived state
```

Example:

```ts
state = {
  trips: [],
  selectedTripId: null,
  loading: false,
};
```

Business rules should not migrate into the Store merely because the Store can execute TypeScript.

### Local state first

Not every state requires a Store.

Prefer component-local state for state that:

- belongs to one component;
- has a short lifecycle;
- does not require coordination;
- does not represent feature-level state.

Introduce a Store when state genuinely needs to be shared or coordinated.

---

# 7. Facades

A Facade provides a simple public interface to a feature's presentation layer.

```text
Component
    │
    ▼
  Facade
  ├──────► Store
  │
  └──────► Application / Use Cases
```

Example:

```ts
@Injectable()
export class TripsFacade {
  readonly trips = this.store.trips;
  readonly loading = this.store.loading;

  load(): void {
    // orchestrate application behavior
  }

  select(id: TripId): void {
    this.store.select(id);
  }
}
```

Components can then interact with:

```ts
facade.trips();
facade.loading();
facade.load();
facade.select(id);
```

without knowing how those operations are implemented.

A Facade is a **role**, not a required inheritance hierarchy.

Do not introduce generic `BaseFacade` or `IFacade` abstractions unless multiple implementations demonstrate a real common contract.

### When to create a Facade

Introduce one when it:

- provides a meaningful feature-level API;
- hides multiple implementation details;
- isolates presentation from state/application implementation;
- significantly simplifies consumers.

Avoid pass-through Facades that provide no meaningful abstraction.

---

# 8. Recommended Interaction

For sufficiently complex business features, the architecture may look like:

```text
Component
    │
    ▼
Facade
    │
    ├────────────► Store
    │
    ▼
Use Case
    │
    ▼
Domain Port / Repository
    ▲
    │
Repository Implementation
    │
    ├──────── Mapper
    │
    ▼
Datasource
    │
    ▼
External API
```

This is **not a mandatory pipeline**.

Each abstraction must justify its existence.

---

# 9. Complexity Levels

Architecture should scale with the problem.

## Simple UI behavior

```text
Component
   │
 Signal
```

Examples:

- dialog visibility;
- selected tab;
- temporary UI state.

## Simple data feature

```text
Component
   │
Facade / Store
   │
Data access
```

Suitable when little or no domain behavior exists.

## Business feature

```text
Component
   │
Facade
   │
Store / Use Cases
   │
Domain
   │
Ports
   ▲
Infrastructure
```

Suitable when the feature contains meaningful business behavior.

The project should evolve toward additional layers **because complexity requires them**, not because templates require them.

---

# 10. Dependency Rules

The following rules should be enforced where practical.

### Domain

May depend on:

```text
domain
shared domain primitives
```

Must not depend on:

```text
Angular
presentation
infrastructure
HTTP
state management
```

### Application

May depend on:

```text
domain
application abstractions
```

Should not depend directly on presentation.

Infrastructure dependencies should be accessed through explicit ports when decoupling is required.

### Infrastructure

May depend on:

```text
domain contracts
application contracts
Angular infrastructure
HTTP
generated API clients
external libraries
```

### Presentation

May depend on:

```text
feature facade
application APIs where appropriate
presentation utilities
design system
```

Presentation must not contain domain rules.

---

# 11. Cross-Domain Communication

Domains must not import another domain's internal implementation.

Keep verticals independent. When one vertical needs another's capability, it
depends on the smallest explicit public contract it needs, not on the other
vertical's services, store, components, datasource, or implementation details.
The owning application or shell composes independently owned verticals.

Avoid:

```text
planning
   ↓
operations/infrastructure/internal-service
```

Prefer communication through:

- explicit public APIs;
- application contracts;
- domain events where justified;
- shared domain primitives when concepts are genuinely shared.

Do not create a global `shared` domain containing unrelated business concepts merely to bypass architectural boundaries.

### Frontend and backend context maps

Frontend boundaries follow user-facing business language, rules and ownership;
they do not have to mirror backend service or bounded-context topology. Align
the two when they represent the same capability, and translate explicitly when
they do not. A frontend-specific application or view model may therefore
compose information from several backend contracts.

That composition does not by itself create a bounded context. A screen, route
or workflow name is insufficient: use domain discovery to establish distinct
language, behavior and ownership before introducing a new vertical. Backend
composition infrastructure such as a BFF requires its own evidence and
architectural decision; it is not a default part of this DDD flow.

---

# 12. AI-Assisted Development

Architecture is part of the project's AI context.

For a new or ambiguous business capability, establish domain events,
invariants, ownership, and context relationships before naming Angular or Nx
artifacts. Use the selective [Event Storming](./event-storming.md) procedure;
skip it when the behavior and owner are already clear.

AI agents should use these rules to determine both:

1. **where code belongs**, and
2. **whether an abstraction should exist at all**.

When implementing functionality, agents must not automatically generate every architectural pattern.

Before introducing:

```text
Facade
Store
Use Case
Repository
Datasource
Mapper
```

the agent should determine what responsibility that abstraction provides.

The expected result is predictable code, not maximum layering.

Architecture should reduce the number of arbitrary implementation choices available to both humans and AI agents.

---

# 13. Testing Implications

Clear responsibilities create clear testing boundaries.

```text
Domain       → business rules
Use Case     → application behavior and orchestration
Mapper       → transformation rules
Store        → state transitions and derived state
Facade       → feature-level orchestration when meaningful
Datasource   → external integration contract
Component    → presentation behavior
```

Tests should focus on observable behavior rather than implementation details.

Pure domain and application code should be testable without Angular whenever possible.

---

# 14. Guiding Rules

When making architectural decisions, apply these rules in order:

1. **Protect domain boundaries.**
2. **Keep business logic independent from infrastructure and presentation.**
3. **Make dependencies explicit.**
4. **Prefer domain language over technical language.**
5. **Introduce patterns only when they provide a clear responsibility.**
6. **Prefer the simplest architecture that preserves the required boundaries.**
7. **Do not create abstractions for hypothetical future requirements.**
8. **Keep the architecture predictable for humans and AI agents.**

> **DDD provides boundaries and language. Clean Architecture provides dependency direction. Patterns such as Use Cases, Repositories, Mappers, Stores and Facades are tools used where they provide value — not mandatory layers.**
