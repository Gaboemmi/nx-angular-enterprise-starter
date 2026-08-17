# Discover domain

## Use when

Before implementing a new or materially changed business capability when its
language, rules, ownership, lifecycle, actors, or cross-context effects are not
already clear. Skip this procedure for cosmetic work, local UI behavior, and
small changes with established ownership and rules.

## Steps

1. Read `docs/architecture/event-storming.md` and frame the requested business
   outcome without naming Angular or Nx artifacts.
2. Capture the actors, commands, past-tense domain events, invariants, policies,
   pivotal events, and unresolved hotspots relevant to the change.
3. Identify the owning bounded context from its business language and behavior,
   not from backend service topology. List external contexts separately and
   state the smallest information or capability exchanged with each one.
4. Write the concise discovery record from the architecture guide in the
   feature specification or implementation plan. Do not create a second source
   of durable architecture.
5. Resolve any open question that could change ownership, an invariant, or a
   public contract before generating code.
6. Translate the validated discovery into the smallest architecture that
   preserves the boundaries. A bounded context is the vertical; features and
   responsibility layers live inside it. Follow `create-feature` only after
   this ownership is explicit.
7. Treat events as domain facts. Introduce runtime events, asynchronous
   messaging, or event sourcing only when the feature requirements justify
   those mechanisms independently.

## Validate

1. Verify that commands express intent, events describe completed facts, and
   every invariant and cross-context reaction has a clear owner.
2. Confirm that no screen, route, component, or technical concern was promoted
   to a bounded context without domain evidence.
3. Check proposed dependencies against `docs/architecture/ddd.md` and
   `docs/architecture/enforcement.md`; never use another vertical's internals.
4. Confirm that unresolved domain decisions are visible and that the proposed
   Nx shape does not exceed what the validated discovery requires.
