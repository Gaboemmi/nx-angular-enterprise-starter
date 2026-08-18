# Local generators

This directory houses local generators that encode the repository's
architectural conventions. Each generator keeps its implementation, schema,
and templates within its own folder.

- `shell`: creates the composition and routing boundary of a bounded context.
- `mapper`: creates a `Mapper<From, To>` class that translates between representations at an architectural boundary.

## shell

```bash
npx nx g ./tools/generators/collection.json:shell --name=orders --no-interactive
```

It generates `libs/domains/orders/shell` with the tag
`scope:orders,type:shell`, registers `orders` in the executable architecture
policy, and creates a public route API. Application routes are updated
explicitly after generating the shell, so the app depends only on that contract
and does not know the domain's features.

## mapper

```bash
npx nx g ./tools/generators/collection.json:mapper --name=TripDtoToTrip --directory=libs/domains/orders/infrastructure/src/lib/mappers --no-interactive
```

It generates a `Mapper<From, To>` subclass extending
`@nx-angular-enterprise-starter/core/ddd` and a corresponding unit-test file.
The class name is derived from the `name` option (accepts PascalCase,
camelCase, or kebab-case). Replace the placeholder `unknown` types with the
concrete representations once the boundary contract is defined.

The other directories (`feature`, `use-case`, `datasource`) are
reserved for future generators. They do not yet expose executable generators.
