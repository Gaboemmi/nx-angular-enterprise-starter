# Core i18n

Platform i18n/l10n runtime with a provider-agnostic translation port.

Use `provideI18n` once at application bootstrap and `I18nService` from
features. Language, locale, and timezone remain independent concerns. The
default static provider uses version-controlled catalogs; a Tolgee adapter can
implement `I18nProvider` without leaking its SDK into feature code.

`provideTestingI18n` installs a deterministic local provider for tests.

## Running unit tests

Run `nx test core-i18n` to execute the unit tests.
