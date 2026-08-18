# Create mapper

## Use when

Translating meaningfully different representations, especially between an external DTO and a domain or application model.

## Steps

1. Confirm a boundary needs protection. Do not create an identity mapper solely to satisfy a pattern.
2. Name both sides explicitly using the `{Source}To{Target}` convention, for example `TripDtoToTrip`, and keep it
   with the owning infrastructure or boundary code. Transport mappers belong to
   `type:infrastructure` when that responsibility is a separate Nx project.
3. Scaffold the mapper and its unit test with the local generator, then replace
   the generated `unknown` types and implementation:

   ```bash
   npx nx g ./tools/generators/collection.json:mapper --name=TripDtoToTrip --directory=libs/domains/trips/infrastructure/src/lib/mappers --no-interactive
   ```

   The generator enforces the `{Source}To{Target}` naming convention and produces:

   ```
   mappers/
     index.ts                                          # barrel file (auto-managed)
     {source-kebab}-to/                                # subdirectory by source type
       {source-kebab}-to-{target-kebab}.mapper.ts
       {source-kebab}-to-{target-kebab}.mapper.spec.ts
   ```

   The barrel file `index.ts` is created or updated automatically with the new export.

4. Extend `Mapper<From, To>` from
   `@nx-angular-enterprise-starter/core/ddd` and implement a synchronous `map`
   method. Use `mapArray` for arrays. Keep mappers synchronous; if you need
   async data resolution, compose in a service that orchestrates fetching and
   mapping separately.
5. Compose focused child mappers when a multi-level source contains nested
   objects with their own meaningful representation boundary. The parent mapper
   may delegate with `childMapper.map` for nested objects and
   `childMapper.mapArray` for nested collections; keep that composition explicit
   and do not duplicate the child transformation in the parent. A child mapper
   may compose further child mappers when the representation has more levels;
   each level remains responsible for its own transformation.
6. Translate naming, optionality, defaults, enums, and temporal semantics deliberately; reject or normalize invalid transport data at the appropriate boundary.
7. Do not perform I/O, inject UI concerns, or embed business workflows in a mapper.

## Validate

1. Unit-test representative mappings, optional values, invalid or unexpected input, array mapping when used, and delegation to nested mappers when composed.
2. Verify DTOs do not leak past the infrastructure/application boundary.
3. Run the affected Nx lint and test targets.
