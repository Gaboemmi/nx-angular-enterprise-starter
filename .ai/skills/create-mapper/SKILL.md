# Create mapper

## Use when

Translating meaningfully different representations, especially between an external DTO and a domain or application model.

## Steps

1. Confirm a boundary needs protection. Do not create an identity mapper solely to satisfy a pattern.
2. Name both sides explicitly, for example `TripDtoToTripMapper`, and keep it with the owning infrastructure or boundary code.
3. Extend `Mapper<From, To>` from `@nx-angular-enterprise-starter/core/ddd` and implement a synchronous `map` method. Use `mapArray` for arrays.
4. Translate naming, optionality, defaults, enums, and temporal semantics deliberately; reject or normalize invalid transport data at the appropriate boundary.
5. Do not perform I/O, inject UI concerns, or embed business workflows in a mapper.

## Validate

1. Unit-test representative mappings, optional values, invalid or unexpected input, and array mapping when used.
2. Verify DTOs do not leak past the infrastructure/application boundary.
3. Run the affected Nx lint and test targets.
