# Create store

## Use when

Feature-level client state must be shared, coordinated, derived, or reset beyond a component's short lifecycle.

## Steps

1. Identify the state owner first. Keep local UI state in components, navigation state in the Router, global state genuinely application-wide, and server data authoritative on the backend.
2. Do not create a store for ephemeral component interaction, reactive form state, or a value determined by the route.
3. Scope a feature or route store to `type:feature` by default. Reusable
   application state may move to `type:application` only when multiple entry
   points in the same bounded context need one owner. Keep stores concrete; do
   not add a generic base store.
4. Model mutually exclusive asynchronous states with a discriminated union when needed.
5. Define concurrency, cancellation, retry, freshness, invalidation, rollback, and tenant/user reset behaviour where applicable.
6. Keep domain rules in domain/application code. A store or facade must not call a datasource directly.

## Validate

1. Test transitions, derived state, errors, reset behavior, and relevant concurrent-request behavior.
2. Verify the Router is the single owner of deep-linkable parameters and no state is duplicated without a reason.
3. Run the affected Nx lint and test targets.
