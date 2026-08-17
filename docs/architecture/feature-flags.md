# Feature flags

## Purpose

Feature flags are a platform capability for controlled UI rollouts,
experiments, and operational changes. Features use the application-owned
`FeatureFlagService`; they do not import OpenFeature or a vendor SDK.

```text
Feature / application code
          ↓
  FeatureFlagService
          ↓
  FeatureFlagProvider
          ↓
Static provider | OpenFeature adapter | vendor adapter
```

## Flag catalogue

Each application owns a central catalogue of flag definitions. A definition
contains a branded key, safe default, owner, description, creation date, and
type. Release flags additionally require an expiry date. The core library does
not own product flags.

```ts
export const FEATURE_FLAGS = {
  trips: {
    newEditor: defineFeatureFlag({
      key: featureFlagKey('trips.new-editor'),
      type: 'release',
      owner: 'trips',
      description: 'Rollout of the new trip editor.',
      createdAt: '2026-08-17',
      expiresAt: '2026-11-17',
      defaultValue: false,
    }),
  },
} as const;
```

Use only `release`, `experiment`, and `operational` flags. The catalogue makes
unreviewed string keys difficult to introduce and makes ownership and cleanup
visible.

## Angular API

`FeatureFlagService` returns signals. Business or application decisions use the
service; the structural directives are only for presentation.

```ts
readonly newTripEditorEnabled = inject(FeatureFlagService).boolean(
  FEATURE_FLAGS.trips.newEditor
);
```

```html
@if (newTripEditorEnabled()) {
<ae-new-trip-editor />
}

<button *featureEnabled="FEATURE_FLAGS.trips.newEditor">Open editor</button>
```

Configure the static adapter at bootstrap for local development and tests:

```ts
provideFeatureFlags({
  flags: { 'trips.new-editor': true },
});
```

Tests must configure the relevant states explicitly. An unconfigured or failed
evaluation always uses the definition's safe default.

## Context and security

Optional evaluation context may contain public user, tenant, organization,
locale, country, and role attributes. Do not place secrets in it.

Feature flags are not authorization. They may change presentation, rollouts,
or implementations, but backend authorization and business invariants remain
enforced independently.

## Provider integration

`OpenFeatureFeatureFlagProvider` accepts the small client contract needed by
the core. The application bootstrap can replace the static provider with this
adapter or a vendor adapter without changing features. Vendor SDK imports stay
inside the adapter implementation.

Remove expired release flags together with their obsolete code.
