import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FeatureFlagService } from './feature-flag.service';
import { defineFeatureFlag, featureFlagKey } from '../domain/feature-flag';
import { FeatureFlagProvider } from '../domain/feature-flag-provider';
import { provideFeatureFlags } from '../provide-feature-flags';

const newTripEditor = defineFeatureFlag({
  key: featureFlagKey('trips.new-editor'),
  type: 'release',
  owner: 'trips',
  description: 'Rollout of the new trip editor.',
  createdAt: '2026-08-17',
  expiresAt: '2026-11-17',
  defaultValue: false,
});

describe('FeatureFlagService', () => {
  it('uses the configured static value and caches the evaluation', () => {
    TestBed.configureTestingModule({
      providers: [provideFeatureFlags({ flags: { 'trips.new-editor': true } })],
    });
    const service = TestBed.inject(FeatureFlagService);

    expect(service.boolean(newTripEditor)()).toBe(true);
    expect(service.boolean(newTripEditor)).toBe(service.boolean(newTripEditor));
  });

  it('exposes the safe default until an async provider resolves', async () => {
    const provider: FeatureFlagProvider = {
      getBoolean: () => Promise.resolve(true),
      getString: (_key, defaultValue) => defaultValue,
      getNumber: (_key, defaultValue) => defaultValue,
      getObject: (_key, defaultValue) => defaultValue,
    };
    TestBed.configureTestingModule({ providers: [provideFeatureFlags({ provider })] });
    const enabled = TestBed.inject(FeatureFlagService).boolean(newTripEditor);

    expect(enabled()).toBe(false);
    await Promise.resolve();
    expect(enabled()).toBe(true);
  });
});
