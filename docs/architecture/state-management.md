# State Management

State management should be predictable, local by default, and proportional to the feature's complexity. The architecture uses a unidirectional, Flux-inspired flow and Angular-native primitives where they fit. This is a principle, not a requirement to adopt a Flux or Redux framework.

## Flow

Separate commands from reads:

```text
commands: Component -> Facade (when useful) -> Use case / Store / Router
reads:    Store or Router -> readonly Signals -> Component

Use case -> repository or port -> infrastructure repository -> datasource
```

Components express user intent. They must not coordinate complex application workflows or access datasources and infrastructure repositories directly. A facade is optional: introduce one when it provides a useful feature-level API or hides meaningful orchestration, not as a pass-through layer.

## Choose an owner

Each meaningful piece of state has one owner. Prefer the narrowest scope that preserves the required behaviour:

| State | Owner | Examples |
| --- | --- | --- |
| Local UI | Component or small component tree | Dialog visibility, temporary form interaction, ephemeral tab. |
| Feature | Feature store | Loaded entities, feature errors, pagination, workflow progress. |
| Navigation | Router | Route params, query params, fragments and route data. |
| Global | Root application service | Authenticated identity, active tenant, locale, runtime configuration. |
| Server | Backend | Authoritative business data. |

Do not create a feature store for state that belongs to one component or has a short lifecycle. Reactive forms own their form state unless a deliberate feature-level workflow needs a projection of it.

## Signals and asynchronous work

Signals are the default for synchronous UI and application state. Expose readonly Signals and use `computed` for derived values. Consumers must not mutate store internals directly.

```ts
readonly incidents = signal<Incident[]>([]);
readonly openIncidents = computed(() =>
  this.incidents().filter((incident) => incident.status === 'OPEN'),
);
```

RxJS remains appropriate for HTTP, WebSockets, event streams, cancellation and complex asynchronous composition. Choose the abstraction that represents the problem; do not introduce RxJS for simple synchronous state or convert every Observable to a Signal mechanically.

Model asynchronous state so invalid combinations are hard to represent. Prefer a discriminated union over unrelated `loading` and `error` flags when a feature needs to distinguish request states:

```ts
type LoadState<T> =
  | { status: 'idle' | 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApplicationError };
```

Define cancellation, concurrent-request and retry behaviour where it matters.

## Router and feature state

The Router is a state container. If a value is meaningful for navigation, deep linking, browser history, bookmarking or page restoration, the Router normally owns it. Do not duplicate a selected entity ID in a store when it is determined by `/incidents/:incidentId`.

Route and query parameters must be serializable and parsed or validated at the feature boundary. `NavigationExtras.state` is ephemeral: it is not a durable source for bookmarked or restored state. Avoid bidirectional Router/store synchronisation; introduce it only with a documented owner and reason.

## Stores, server data and scope

A feature store may hold feature-level client state, readonly projections, controlled transitions and reset behaviour. It does not own domain rules: business behaviour belongs in domain and application code. External communication follows the repository boundary; stores and facades do not call datasources directly.

Server data remains authoritative. When client state caches or optimistically projects server data, define its freshness, invalidation after mutations, revalidation and rollback behaviour. Reset state scoped to an authenticated user or tenant when that identity or tenant changes.

Provide feature state at the feature or route scope by default. Use root scope only for genuinely application-wide state; do not create one global store for unrelated features.

## Libraries and shared abstractions

No state-management library is required. A library such as NgRx is justified only by concrete needs, for example complex cross-feature coordination, event workflows, state history or debugging requirements.

Likewise, do not introduce a generic `StateStore<T>`, `RouterStore` or base facade before multiple concrete features demonstrate a stable common contract. Keep feature stores concrete until that point.

## Testing and enforcement

Test store transitions and derived state, facade orchestration, and observable component behaviour. Test Router-owned state through navigation behaviour. Nx dependency boundaries enforce that presentation code does not access infrastructure directly; tests should cover rules that dependency constraints cannot express.

## Rules

1. State has one clear owner and flows in one direction.
2. Keep it as close as possible to its consumers.
3. Prefer derived state to duplicated state.
4. Treat Router state as application state and do not duplicate it by default.
5. Keep global state small and server data authoritative.
6. Use stores, facades and libraries only when they solve a concrete problem.
