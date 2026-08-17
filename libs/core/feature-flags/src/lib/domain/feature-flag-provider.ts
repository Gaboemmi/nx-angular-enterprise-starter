import { FeatureFlagContext } from './feature-flag-context';
import { FeatureFlagKey } from './feature-flag';

/**
 * Provider port implemented by local, OpenFeature, or vendor adapters.
 *
 * Providers may evaluate locally or asynchronously. Consumers always receive
 * a signal with the flag definition's safe default while an async evaluation
 * is pending or unavailable.
 */
export interface FeatureFlagProvider {
  getBoolean(
    key: FeatureFlagKey,
    defaultValue: boolean,
    context?: FeatureFlagContext,
  ): boolean | Promise<boolean>;

  getString(
    key: FeatureFlagKey,
    defaultValue: string,
    context?: FeatureFlagContext,
  ): string | Promise<string>;

  getNumber(
    key: FeatureFlagKey,
    defaultValue: number,
    context?: FeatureFlagContext,
  ): number | Promise<number>;

  getObject<TValue extends Readonly<Record<string, unknown>>>(
    key: FeatureFlagKey,
    defaultValue: TValue,
    context?: FeatureFlagContext,
  ): TValue | Promise<TValue>;
}
