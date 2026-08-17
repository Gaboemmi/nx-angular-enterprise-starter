import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { defineFeatureFlag, featureFlagKey } from '../domain/feature-flag';
import { provideFeatureFlags } from '../provide-feature-flags';
import { FeatureEnabledDirective } from './feature-enabled.directive';

const exportV2 = defineFeatureFlag({
  key: featureFlagKey('trips.export-v2'),
  type: 'release',
  owner: 'trips',
  description: 'Rollout of the second export flow.',
  createdAt: '2026-08-17',
  expiresAt: '2026-11-17',
  defaultValue: false,
});

@Component({
  imports: [FeatureEnabledDirective],
  template: '<button *featureEnabled="exportV2">Export V2</button>',
})
class TestHost {
  readonly exportV2 = exportV2;
}

describe('FeatureEnabledDirective', () => {
  it('renders only when the flag is enabled', async () => {
    await TestBed.configureTestingModule({
      providers: [provideFeatureFlags({ flags: { 'trips.export-v2': true } })],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestHost);

    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).not.toBeNull();
  });
});
