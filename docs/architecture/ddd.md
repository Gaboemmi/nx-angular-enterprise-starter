# Domain-Driven Design

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
export class ReleaseTripUseCase {
  constructor(
    private readonly trips: TripRepository,
  ) {}

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
export class TripMapper {
  static fromDto(dto: TripDto): Trip {
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
transform(dto: CountryDto): Country {
  return dto;
}
```

unless the separation protects an intentional architectural boundary.

---

# 6. Store

Stores manage client-side state.

They are **not part of DDD itself**.

They belong to the frontend architecture and may use Angular Signals or the project's selected state-management solution.

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

Prefer component-local Signals for state that:

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

---

# 12. AI-Assisted Development

Architecture is part of the project's AI context.

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