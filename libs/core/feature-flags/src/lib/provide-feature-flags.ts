import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FeatureFlagProvider } from './domain/feature-flag-provider';
import {
  StaticFeatureFlagProvider,
  StaticFeatureFlags,
} from './infrastructure/static/static-feature-flag.provider';

/** The configured application-wide feature flag provider. */
export const FEATURE_FLAG_PROVIDER = new InjectionToken<FeatureFlagProvider>(
  'FEATURE_FLAG_PROVIDER',
  {
    factory: () => new StaticFeatureFlagProvider(),
  },
);

export interface FeatureFlagsConfig {
  /** Explicit adapter. Takes precedence over the local static map. */
  readonly provider?: FeatureFlagProvider;
  /** Deterministic values used when no external provider is configured. */
  readonly flags?: StaticFeatureFlags;
}

/** Configures feature flags once at application bootstrap. */
export function provideFeatureFlags(config: FeatureFlagsConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: FEATURE_FLAG_PROVIDER,
      useValue: config.provider ?? new StaticFeatureFlagProvider(config.flags),
    },
  ]);
}
