import { I18nProvider } from '../domain/i18n-provider';
import { TranslationCatalogs, TranslationKey, TranslationParameters } from '../domain/i18n-types';

/** Deterministic, version-controlled provider for local development and tests. */
export class StaticTranslationProvider implements I18nProvider {
  constructor(private readonly catalogs: TranslationCatalogs = {}) {}

  translate(
    key: TranslationKey,
    language: string,
    fallbackLanguage: string,
    parameters: TranslationParameters = {},
  ): string {
    const translation = this.resolve(key, language, fallbackLanguage);
    return translation === undefined ? key : interpolate(translation, parameters);
  }

  private resolve(
    key: TranslationKey,
    language: string,
    fallbackLanguage: string,
  ): string | undefined {
    for (const candidate of languageFallbacks(language, fallbackLanguage)) {
      const catalog = this.catalogs[candidate];
      const translation = catalog?.[key];
      if (translation !== undefined) {
        return translation;
      }
    }
    return undefined;
  }
}

function languageFallbacks(language: string, fallbackLanguage: string): readonly string[] {
  return [...new Set([...languageHierarchy(language), ...languageHierarchy(fallbackLanguage)])];
}

function languageHierarchy(language: string): readonly string[] {
  const segments = language.split('-');
  return segments.map((_, index) => segments.slice(0, segments.length - index).join('-'));
}

function interpolate(template: string, parameters: TranslationParameters): string {
  return template.replace(/{{\s*([\w.-]+)\s*}}/g, (placeholder, name: string) => {
    const value = parameters[name];
    return value === undefined ? placeholder : String(value);
  });
}
