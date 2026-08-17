import { TranslationKey, TranslationParameters } from './i18n-types';

/**
 * Provider port for translation runtimes. Tolgee and local catalogs implement
 * this contract so application code remains independent of either choice.
 */
export interface I18nProvider {
  translate(
    key: TranslationKey,
    language: string,
    fallbackLanguage: string,
    parameters?: TranslationParameters,
  ): string;
}
