# Application composition

## Shell library pattern

A shell is the composition boundary of one bounded context. It owns the
context's route tree, feature composition, route-level providers, guards,
resolvers and domain layout when those responsibilities are needed. It is not a
feature and it is not merely a lazy-loading wrapper.

```text
type:app
    |
    v
type:shell
    |
    +--> type:feature
    +--> type:feature
```

The app imports the shell's public routes, never individual business features.
The shell may lazy-load its features. A feature never imports, lazy-loads,
navigates by loading code from, or composes another feature. `import()` changes
loading strategy, not the dependency the Nx boundary rule evaluates.

## Minimum contract

Each shell is an Angular library tagged `scope:domain,type:shell` and exposes a
single public routing contract from its `src/index.ts`:

```ts
export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@nx-angular-enterprise-starter/orders/feature-list').then(
        (m) => m.ORDERS_LIST_ROUTES,
      ),
  },
];
```

The app connects it explicitly:

```ts
{
  path: 'orders',
  loadChildren: () =>
    import('@nx-angular-enterprise-starter/orders/shell').then((m) => m.ORDERS_ROUTES),
}
```

Keep the initial shell route array empty until there are actual features to
compose. Do not introduce a component, module, feature facade, or state store
to a shell unless its composition responsibility requires one.

## Generate

```bash
npx nx g ./tools/generators/collection.json:shell --name=orders --no-interactive
```

This creates `libs/domains/orders/shell`, its public route contract and its
project tags. Add feature routes manually to preserve an explicit composition
decision.

## Enforcement

`@nx/enforce-module-boundaries` enforces the dependency matrix in
`eslint.config.mjs`:

- `type:app` may depend on `type:shell` and cross-cutting platform/UI/util libraries.
- `type:shell` may depend on `type:feature` and application/domain/platform/UI/util libraries.
- `type:feature` may not depend on another `type:feature` or a `type:shell`.

The rules work only when every library has truthful scope and responsibility
tags. Do not use untagged libraries or broad ESLint allowlists to bypass them.
