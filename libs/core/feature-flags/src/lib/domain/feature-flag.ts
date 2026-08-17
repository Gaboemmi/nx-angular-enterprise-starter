declare const featureFlagKeyBrand: unique symbol;

/** A catalogued key. Create keys only with {@link featureFlagKey}. */
export type FeatureFlagKey = string & {
  readonly [featureFlagKeyBrand]: 'FeatureFlagKey';
};

export type FeatureFlagType = 'release' | 'experiment' | 'operational';

export type FeatureFlagValue = boolean | string | number | Readonly<Record<string, unknown>>;

interface FeatureFlagMetadata<TValue extends FeatureFlagValue> {
  readonly key: FeatureFlagKey;
  readonly defaultValue: TValue;
  readonly owner: string;
  readonly description: string;
  readonly createdAt: string;
}

export interface ReleaseFeatureFlag<TValue extends FeatureFlagValue>
  extends FeatureFlagMetadata<TValue> {
  readonly type: 'release';
  /** Release flags must expire so their obsolete branch is removed. */
  readonly expiresAt: string;
}

export interface ExperimentFeatureFlag<TValue extends FeatureFlagValue>
  extends FeatureFlagMetadata<TValue> {
  readonly type: 'experiment';
  readonly expiresAt?: string;
}

export interface OperationalFeatureFlag<TValue extends FeatureFlagValue>
  extends FeatureFlagMetadata<TValue> {
  readonly type: 'operational';
  readonly expiresAt?: string;
}

export type FeatureFlagDefinition<TValue extends FeatureFlagValue> =
  | ReleaseFeatureFlag<TValue>
  | ExperimentFeatureFlag<TValue>
  | OperationalFeatureFlag<TValue>;

export type BooleanFeatureFlag = FeatureFlagDefinition<boolean>;
export type StringFeatureFlag = FeatureFlagDefinition<string>;
export type NumberFeatureFlag = FeatureFlagDefinition<number>;
export type ObjectFeatureFlag<TValue extends Readonly<Record<string, unknown>>> =
  FeatureFlagDefinition<TValue>;

/** Brands a string as a key declared by the application's flag catalog. */
export function featureFlagKey(key: string): FeatureFlagKey {
  return key as FeatureFlagKey;
}

/** Preserves metadata and value types when defining an application flag. */
export function defineFeatureFlag<TValue extends FeatureFlagValue>(
  definition: FeatureFlagDefinition<TValue>,
): FeatureFlagDefinition<TValue> {
  return definition;
}
