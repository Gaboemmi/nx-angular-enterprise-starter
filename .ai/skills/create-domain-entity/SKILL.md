# Create domain entity

## Use when

Introducing a business concept with identity, lifecycle, invariants, or behavior that must remain independent of Angular and infrastructure.

## Steps

1. Confirm the concept belongs to one business domain and name it in the ubiquitous language.
2. Model identity, valid state, and behavior explicitly. Prefer methods that express business actions over exposing a mutable data bag.
3. Keep it framework-independent TypeScript. It must not import Angular, HTTP, DTOs, persistence models, state libraries, or provider SDKs.
4. Put reusable domain rules in domain services only when they do not naturally belong to one entity.
5. Create value objects or narrow types when they make invalid states harder to represent; do not promote feature concepts to `core` without a proven shared contract.

## Validate

1. Unit-test invariants, legal and illegal transitions, and temporal semantics without Angular test utilities.
2. Check dependency direction and public exports so another domain cannot reach internal implementation.
3. Run the affected Nx lint and test targets.
