/** A semantic, stable identifier owned by a feature or shared namespace. */
export type TranslationKey = string;

/** Values interpolated in a translation template such as `Welcome, {{name}}`. */
export type TranslationParameters = Readonly<Partial<Record<string, string | number>>>;

/** A version-controlled catalog for one language or regional language variant. */
export type TranslationCatalog = Readonly<Partial<Record<TranslationKey, string>>>;

/** Catalogs keyed by BCP 47 language tags such as `en` or `en-GB`. */
export type TranslationCatalogs = Readonly<Partial<Record<string, TranslationCatalog>>>;

/** The independently resolved language and regional locale for application content. */
export interface LocalizationContext {
  readonly language: string;
  readonly locale: string;
}
