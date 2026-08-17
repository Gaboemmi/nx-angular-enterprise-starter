# Create facade

## Use when

A complex feature needs a stable presentation-facing API that hides meaningful coordination among state, use cases, and navigation.

## Steps

1. Confirm the facade adds an abstraction. Do not create a pass-through wrapper around one dependency.
2. Keep it feature-owned in `type:feature` by default and expose a small API of
   readonly state and intent-oriented commands for components. Do not create a
   separate project only to hold a facade.
3. Coordinate stores, use cases, and Router interactions as required; components must not access datasources or infrastructure repositories directly.
4. Keep business rules in domain/application code and transport concerns in infrastructure.
5. Avoid base facades and broad `IFacade` contracts until concrete feature implementations demonstrate a stable shared responsibility.
6. Make feature internals private; export the facade only when it is the intended presentation boundary.

## Validate

1. Test feature-level orchestration and public observable state, not internal call sequences alone.
2. Verify components depend on the facade or allowed application APIs, never infrastructure.
3. Run the affected Nx lint and test targets.
