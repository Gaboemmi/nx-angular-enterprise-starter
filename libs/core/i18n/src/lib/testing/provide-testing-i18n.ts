import { EnvironmentProviders } from '@angular/core';
import { TranslationCatalogs } from '../domain/i18n-types';
import { ProvideI18nOptions, provideI18n } from '../provide-i18n';

export interface TestingI18nOptions extends Omit<ProvideI18nOptions, 'provider'> {
  readonly catalogs?: TranslationCatalogs;
}

/** Provides an isolated, deterministic i18n runtime for unit and component tests. */
export function provideTestingI18n(options: TestingI18nOptions = {}): EnvironmentProviders {
  return provideI18n({ language: 'en', locale: 'en-GB', ...options });
}
