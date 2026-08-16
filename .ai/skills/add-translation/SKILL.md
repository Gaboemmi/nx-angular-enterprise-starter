# Add translation

## Use when

Adding or changing user-facing application text and its translation contract.

## Steps

1. Check whether an existing semantic key already expresses the same meaning. Do not duplicate keys or use rendered source text as a key.
2. Put feature terminology in its domain namespace and use `common.*` only for genuinely shared semantics.
3. Use a stable semantic key, such as `orders.create.submit`, independent of the translated wording.
4. Update the versioned source catalogs and follow the established catalog synchronization workflow when it exists. Do not make a translation platform the only source of truth.
5. Consume the centralized project i18n API. Do not call a provider SDK directly from a business feature or hardcode user-facing text.
6. Keep language, locale, and timezone separate; use localization infrastructure for regional formatting rather than scattered `toLocaleString` calls.

## Validate

1. Check catalog structure and key presence in every required language according to the configured tooling.
2. Test the component with deterministic i18n facilities, including missing-key behavior where relevant, without external services.
3. Run the affected Nx lint and test targets.
