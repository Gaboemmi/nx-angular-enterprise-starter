# Local generators

This directory houses local generators that encode the repository's
architectural conventions. Each generator keeps its implementation, schema,
and templates within its own folder.

- `shell`: creates the composition and routing boundary of a bounded context.

The `shell` generator is available through the local collection:

```bash
npx nx g ./tools/generators/collection.json:shell --name=orders --no-interactive
```

It generates `libs/domains/orders/shell` with the tag `scope:domain,type:shell`
and a public route API. Application routes are updated explicitly after
generating the shell, so the app depends only on that contract and does not
know the domain's features.

The other directories (`feature`, `use-case`, `mapper`, `datasource`) are
reserved for future generators. They do not yet expose executable generators.
