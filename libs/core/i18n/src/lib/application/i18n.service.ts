import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { TranslationKey, TranslationParameters } from '../domain/i18n-types';
import { I18N_CONFIG, I18N_PROVIDER } from '../provide-i18n';

/** Central signal-first API for translation, language, locale, and formatting. */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly config = inject(I18N_CONFIG);
  private readonly provider = inject(I18N_PROVIDER);
  private readonly selectedLanguage = signal(this.config.language);
  private readonly selectedLocale = signal(this.config.locale);

  readonly language: Signal<string> = this.selectedLanguage.asReadonly();
  readonly locale: Signal<string> = this.selectedLocale.asReadonly();
  readonly context = computed(() => ({ language: this.language(), locale: this.locale() }));

  setLanguage(language: string): void {
    this.selectedLanguage.set(language);
  }

  setLocale(locale: string): void {
    this.selectedLocale.set(locale);
  }

  translate(key: TranslationKey, parameters?: TranslationParameters): string {
    return this.provider.translate(key, this.language(), this.config.fallbackLanguage, parameters);
  }

  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.locale(), options).format(value);
  }

  formatCurrency(value: number, currency: string, options?: Intl.NumberFormatOptions): string {
    return this.formatNumber(value, { ...options, currency, style: 'currency' });
  }

  formatDate(value: Date | number, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.locale(), options).format(value);
  }
}
