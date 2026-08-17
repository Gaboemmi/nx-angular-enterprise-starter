import { FeatureFlagContext } from '../../domain/feature-flag-context';
import { FeatureFlagKey } from '../../domain/feature-flag';
import { FeatureFlagProvider } from '../../domain/feature-flag-provider';

/** The small part of an OpenFeature client used by this adapter. */
export interface OpenFeatureClient {
  getBooleanValue(
    key: string,
    defaultValue: boolean,
    context?: FeatureFlagContext,
  ): boolean | Promise<boolean>;
  getStringValue(
    key: string,
    defaultValue: string,
    context?: FeatureFlagContext,
  ): string | Promise<string>;
  getNumberValue(
    key: string,
    defaultValue: number,
    context?: FeatureFlagContext,
  ): number | Promise<number>;
  getObjectValue<TValue extends Readonly<Record<string, unknown>>>(
    key: string,
    defaultValue: TValue,
    context?: FeatureFlagContext,
  ): TValue | Promise<TValue>;
}

/** Adapts an OpenFeature client without leaking its SDK into application code. */
export class OpenFeatureFeatureFlagProvider implements FeatureFlagProvider {
  constructor(private readonly client: OpenFeatureClient) {}

  getBoolean(
    key: FeatureFlagKey,
    defaultValue: boolean,
    context?: FeatureFlagContext,
  ): boolean | Promise<boolean> {
    return this.client.getBooleanValue(key, defaultValue, context);
  }

  getString(
    key: FeatureFlagKey,
    defaultValue: string,
    context?: FeatureFlagContext,
  ): string | Promise<string> {
    return this.client.getStringValue(key, defaultValue, context);
  }

  getNumber(
    key: FeatureFlagKey,
    defaultValue: number,
    context?: FeatureFlagContext,
  ): number | Promise<number> {
    return this.client.getNumberValue(key, defaultValue, context);
  }

  getObject<TValue extends Readonly<Record<string, unknown>>>(
    key: FeatureFlagKey,
    defaultValue: TValue,
    context?: FeatureFlagContext,
  ): TValue | Promise<TValue> {
    return this.client.getObjectValue(key, defaultValue, context);
  }
}
