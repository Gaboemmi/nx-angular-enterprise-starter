# Create use case

## Use when

Adding an application operation that expresses business intent, coordinates dependencies, or is reused from more than one entry point.

## Steps

1. Confirm that the operation adds application semantics. Do not wrap a trivial delegation merely to create a layer.
2. Name it after the intent, such as `ReleaseTripUseCase`, rather than an HTTP request or provider operation.
3. Place it in the owning feature's application boundary and depend on domain models and explicit ports, never on Angular UI, HTTP clients, DTOs, or provider SDKs.
4. Implement `UseCase<Input, Output>` from `@nx-angular-enterprise-starter/core/ddd`; select a synchronous value, `Promise`, or stream only when it matches the operation.
5. Keep domain rules in domain entities or services. Let the use case orchestrate the workflow, authorization decisions, and port calls.
6. Expose it only through the feature API when another boundary genuinely needs it.

## Validate

1. Unit-test observable outcomes and port interactions with deterministic doubles.
2. Verify that input and output types use domain/application concepts rather than transport DTOs.
3. Run the affected Nx lint and test targets, then review imports for dependency-boundary compliance.
