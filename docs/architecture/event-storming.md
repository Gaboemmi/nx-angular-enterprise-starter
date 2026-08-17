# Event Storming for Domain Discovery

Event Storming is the repository's preferred collaborative technique for
discovering business boundaries when a capability is new, ambiguous, or spans
multiple responsibilities. It connects business understanding to the
domain-oriented Nx architecture without starting from Angular components,
services, routes, or libraries.

```text
business behavior
       ↓
Event Storming
       ↓
bounded contexts and context map
       ↓
vertical slices and public contracts
       ↓
Nx boundaries
       ↓
Angular implementation
```

It is a discovery tool, not a mandatory ceremony. Its output is a set of
architectural hypotheses that must be validated with people who understand the
domain.

## When to use it

Use domain discovery when a change introduces or significantly alters a
business capability and one or more of these conditions apply:

- the language or desired outcome is ambiguous;
- business rules or lifecycle transitions are important;
- several actors or responsibilities participate;
- more than one bounded context may react to the change;
- ownership or the integration contract is unclear;
- the change may reveal a new domain boundary.

Skip it for cosmetic changes, local UI state, copy changes, tooltips, and other
work whose ownership and behavior are already clear. A short discovery pass is
usually sufficient for one feature; a Big Picture workshop is justified only
when the wider business flow or its boundaries are unknown.

## Building blocks

Start with facts that matter to the business and name them in the past tense:

```text
OrderPlaced
PaymentAuthorized
InventoryReserved
OrderShipped
```

Do not confuse them with commands, which express intent:

```text
PlaceOrder       → OrderPlaced
AuthorizePayment → PaymentAuthorized
ShipOrder        → OrderShipped
```

Add the minimum information needed to explain why the timeline changes:

- **Actor:** the person or system that issues a command.
- **Command:** an intention to change business state.
- **Domain event:** a fact that the business recognizes after it happened.
- **Invariant:** a rule that must always hold.
- **Policy:** a reaction that may issue a new command after an event.
- **Pivotal event:** a fact after which responsibility, rules, or process phase
  changes materially.
- **Swimlane:** a visual grouping that exposes parallel flows or distinct
  responsibilities.
- **Hotspot:** an ambiguity or disagreement that needs a domain decision.

A pivotal event is evidence of a possible boundary, not proof of one. Likewise,
a domain event does not by itself require a message broker, asynchronous
delivery, event sourcing, or a public TypeScript event class.

In a detailed pass, associate a command with the aggregate or domain decision
point that protects its invariants. Discover that model after the event flow
and ownership; do not start by designing entities or services.

## Discovery workflow

1. Frame the business capability, its actors, trigger, and observable outcome.
2. Build a time-ordered flow of relevant domain events. Include failure and
   cancellation paths when they change business decisions.
3. Add the commands that cause those events and the actors or policies that
   issue the commands.
4. Capture invariants, terminology disagreements, unknowns, and pivotal events.
5. Group behavior by cohesive language, rules, ownership, and change cadence.
   Treat these groups as bounded-context candidates, not final folders.
6. Name the owning context and the external contexts that react or provide a
   capability. Describe the smallest information each relationship needs.
7. Define a context map: ownership, direction of collaboration, and explicit
   contracts. Do not solve integration by importing another context's internals.
8. Only then decide whether the capability needs new verticals, features,
   responsibility libraries, shell composition, or Nx constraints.

Record unresolved questions instead of hiding them in an implementation
assumption. If an answer can change ownership, an invariant, or a public
contract, resolve it before generating code.

## Discovery record

For a feature-level discovery, capture a concise record in the feature
specification or implementation plan:

```text
Capability:
Outcome:
Actors:
Commands:
Domain events:
Invariants:
Pivotal events:
Owning bounded context:
External contexts:
Integration contracts:
Open questions:
Architecture impact:
```

This record is a reasoning artifact, not a second source of durable
architecture. Promote stable boundaries to the architecture documentation and
significant decisions to an ADR; keep feature-specific requirements with the
feature specification.

## Example: cancel an order

```text
Capability: Cancel an order before shipment
Actor: Customer
Command: CancelOrder
Relevant events: OrderPlaced, OrderConfirmed, OrderCancelled, OrderShipped
Invariant: A shipped order cannot be cancelled
Owning bounded context: Commerce
External contexts: Billing, Inventory, Notifications
```

The resulting collaboration may be described without choosing a frontend
structure:

```text
Commerce: OrderCancelled
    ├── Billing: refund may be requested
    ├── Inventory: reservation may be released
    └── Notifications: cancellation may be communicated
```

Each reaction remains owned by its context. The discovery does not authorize
Commerce to import Billing, Inventory, or Notifications internals, and it does
not prescribe whether the contract is synchronous, asynchronous, local, or
remote.

## Translation to this workspace

Use the discovery output in this order:

1. A bounded context establishes the business vertical and its owner.
2. Features express cohesive capabilities inside that vertical.
3. Domain, application, infrastructure, and presentation remain internal
   responsibilities introduced only as complexity requires.
4. A `type:shell` library is the application's routing and composition boundary
   for a delivered bounded context, even when it initially exposes one feature.
5. Cross-context work uses runtime APIs/events, application composition, or a
   deliberately shared stable contract, never a direct import into another scope.
6. Nx tags and dependency rules enforce the physical boundaries the workspace
   has actually adopted.

The scope registry and executable dependency policy identify bounded contexts
exactly. It is currently empty because the starter has no real business context;
register the first context when discovery leads to its first Nx project boundary.
See [Executable architecture](./enforcement.md) rather than inventing a tag
scheme during feature implementation.

See [Domain-Driven Design](./ddd.md) for responsibility and dependency
direction and [Application composition](./application-composition.md) for the
shell boundary.
