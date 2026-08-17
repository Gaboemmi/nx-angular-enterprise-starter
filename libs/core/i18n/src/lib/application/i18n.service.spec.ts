import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { I18nService } from './i18n.service';
import { provideTestingI18n } from '../testing/provide-testing-i18n';

describe('I18nService', () => {
  it('keeps language and locale independent while resolving translations', () => {
    TestBed.configureTestingModule({
      providers: [
        provideTestingI18n({
          language: 'en-GB',
          locale: 'es-ES',
          catalogs: {
            en: { 'common.greeting': 'Hello, {{name}}' },
            es: { 'common.greeting': 'Hola, {{name}}' },
          },
        }),
      ],
    });
    const i18n = TestBed.inject(I18nService);

    expect(i18n.context()).toEqual({ language: 'en-GB', locale: 'es-ES' });
    expect(i18n.translate('common.greeting', { name: 'Ada' })).toBe('Hello, Ada');

    i18n.setLanguage('es');

    expect(i18n.translate('common.greeting', { name: 'Ada' })).toBe('Hola, Ada');
    expect(i18n.locale()).toBe('es-ES');
  });

  it('uses the fallback language and returns missing keys visibly', () => {
    TestBed.configureTestingModule({
      providers: [
        provideTestingI18n({
          language: 'fr-CA',
          catalogs: { en: { 'common.save': 'Save' } },
        }),
      ],
    });
    const i18n = TestBed.inject(I18nService);

    expect(i18n.translate('common.save')).toBe('Save');
    expect(i18n.translate('common.unknown')).toBe('common.unknown');
  });

  it('formats semantic values using the independently selected locale', () => {
    TestBed.configureTestingModule({
      providers: [provideTestingI18n({ locale: 'de-DE' })],
    });
    const i18n = TestBed.inject(I18nService);

    expect(i18n.formatNumber(1234.5)).toBe('1.234,5');
  });
});
