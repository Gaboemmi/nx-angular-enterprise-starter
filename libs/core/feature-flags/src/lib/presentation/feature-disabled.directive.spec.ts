import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { defineFeatureFlag, featureFlagKey } from '../domain/feature-flag';
import { provideFeatureFlags } from '../provide-feature-flags';
import { FeatureDisabledDirective } from './feature-disabled.directive';

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
  imports: [FeatureDisabledDirective],
  template: '<button *featureDisabled="exportV2">Legacy Export</button>',
})
class TestHost {
  readonly exportV2 = exportV2;
}

describe('FeatureDisabledDirective', () => {
  it('renders when the flag is disabled', async () => {
    await TestBed.configureTestingModule({
      providers: [provideFeatureFlags({ flags: { 'trips.export-v2': false } })],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestHost);

    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).not.toBeNull();
  });

  it('does not render when the flag is enabled', async () => {
    await TestBed.configureTestingModule({
      providers: [provideFeatureFlags({ flags: { 'trips.export-v2': true } })],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestHost);

    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
  });

  it('falls back to the default value when no override is provided', async () => {
    await TestBed.configureTestingModule({
      providers: [provideFeatureFlags({})],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestHost);

    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).not.toBeNull();
  });
});
