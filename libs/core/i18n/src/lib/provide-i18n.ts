import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { I18nProvider } from './domain/i18n-provider';
import { TranslationCatalogs } from './domain/i18n-types';
import { StaticTranslationProvider } from './infrastructure/static-translation.provider';

export interface I18nConfig {
  /** Initial content language, independently resolved from the regional locale. */
  readonly language: string;
  /** Initial BCP 47 locale used only for regional formatting. */
  readonly locale: string;
  /** Last language used when a catalog does not provide a regional override. */
  readonly fallbackLanguage: string;
}

export const I18N_CONFIG = new InjectionToken<I18nConfig>('I18N_CONFIG');

export const I18N_PROVIDER = new InjectionToken<I18nProvider>('I18N_PROVIDER');

export interface ProvideI18nOptions extends Partial<I18nConfig> {
  /** Explicit infrastructure adapter, for example a Tolgee-backed implementation. */
  readonly provider?: I18nProvider;
  /** Local catalogs used when no explicit provider is configured. */
  readonly catalogs?: TranslationCatalogs;
}

/** Configures the application-wide i18n runtime once at bootstrap. */
export function provideI18n(options: ProvideI18nOptions = {}): EnvironmentProviders {
  const config: I18nConfig = {
    language: options.language ?? 'en',
    locale: options.locale ?? 'en-US',
    fallbackLanguage: options.fallbackLanguage ?? 'en',
  };

  return makeEnvironmentProviders([
    { provide: I18N_CONFIG, useValue: config },
    {
      provide: I18N_PROVIDER,
      useValue: options.provider ?? new StaticTranslationProvider(options.catalogs),
    },
  ]);
}
