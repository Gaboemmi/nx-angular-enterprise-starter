import { FeatureFlagKey } from '../../domain/feature-flag';
import { FeatureFlagProvider } from '../../domain/feature-flag-provider';

export type StaticFeatureFlags = Readonly<Record<string, unknown>>;

/** Deterministic provider for local development, tests, and Storybook. */
export class StaticFeatureFlagProvider implements FeatureFlagProvider {
  constructor(private readonly flags: StaticFeatureFlags = {}) {}

  getBoolean(key: FeatureFlagKey, defaultValue: boolean): boolean {
    const value = this.flags[key];
    return typeof value === 'boolean' ? value : defaultValue;
  }

  getString(key: FeatureFlagKey, defaultValue: string): string {
    const value = this.flags[key];
    return typeof value === 'string' ? value : defaultValue;
  }

  getNumber(key: FeatureFlagKey, defaultValue: number): number {
    const value = this.flags[key];
    return typeof value === 'number' ? value : defaultValue;
  }

  getObject<TValue extends Readonly<Record<string, unknown>>>(
    key: FeatureFlagKey,
    defaultValue: TValue,
  ): TValue {
    const value = this.flags[key];
    return isRecord(value) ? (value as TValue) : defaultValue;
  }
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
