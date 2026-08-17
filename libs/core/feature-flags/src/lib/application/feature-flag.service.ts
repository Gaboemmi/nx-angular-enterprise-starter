import { Injectable, Signal, inject, signal } from '@angular/core';
import {
  BooleanFeatureFlag,
  FeatureFlagDefinition,
  FeatureFlagValue,
  NumberFeatureFlag,
  ObjectFeatureFlag,
  StringFeatureFlag,
} from '../domain/feature-flag';
import { FeatureFlagContext } from '../domain/feature-flag-context';
import { FeatureFlagProvider } from '../domain/feature-flag-provider';
import { FEATURE_FLAG_PROVIDER } from '../provide-feature-flags';

/** Signal-first application API for evaluating catalogued feature flags. */
@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private readonly provider = inject(FEATURE_FLAG_PROVIDER);
  private readonly evaluations = new Map<string, Signal<FeatureFlagValue>>();

  boolean(flag: BooleanFeatureFlag, context?: FeatureFlagContext): Signal<boolean> {
    return this.evaluate(flag, context, (provider, evaluationContext) =>
      provider.getBoolean(flag.key, flag.defaultValue, evaluationContext),
    );
  }

  string(flag: StringFeatureFlag, context?: FeatureFlagContext): Signal<string> {
    return this.evaluate(flag, context, (provider, evaluationContext) =>
      provider.getString(flag.key, flag.defaultValue, evaluationContext),
    );
  }

  number(flag: NumberFeatureFlag, context?: FeatureFlagContext): Signal<number> {
    return this.evaluate(flag, context, (provider, evaluationContext) =>
      provider.getNumber(flag.key, flag.defaultValue, evaluationContext),
    );
  }

  object<TValue extends Readonly<Record<string, unknown>>>(
    flag: ObjectFeatureFlag<TValue>,
    context?: FeatureFlagContext,
  ): Signal<TValue> {
    return this.evaluate(flag, context, (provider, evaluationContext) =>
      provider.getObject(flag.key, flag.defaultValue, evaluationContext),
    );
  }

  private evaluate<TValue extends FeatureFlagValue>(
    flag: FeatureFlagDefinition<TValue>,
    context: FeatureFlagContext | undefined,
    evaluate: (
      provider: FeatureFlagProvider,
      evaluationContext: FeatureFlagContext | undefined,
    ) => TValue | Promise<TValue>,
  ): Signal<TValue> {
    if (context === undefined) {
      const cached = this.evaluations.get(flag.key) as Signal<TValue> | undefined;
      if (cached !== undefined) {
        return cached;
      }
    }

    const value = signal(flag.defaultValue);
    try {
      const result = evaluate(this.provider, context);
      if (isPromise(result)) {
        void result.then(
          (resolvedValue) => {
            value.set(resolvedValue);
          },
          () => {
            value.set(flag.defaultValue);
          },
        );
      } else {
        value.set(result);
      }
    } catch {
      value.set(flag.defaultValue);
    }

    const evaluation = value.asReadonly();
    if (context === undefined) {
      this.evaluations.set(flag.key, evaluation);
    }
    return evaluation;
  }
}

function isPromise<TValue>(value: TValue | Promise<TValue>): value is Promise<TValue> {
  return typeof (value as Promise<TValue>).then === 'function';
}
