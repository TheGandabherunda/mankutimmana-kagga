import { describe, it, expect } from 'vitest';
import { knTranslations } from '../src/i18n/kn';
import { enTranslations } from '../src/i18n/en';

describe('i18n Parity & Completeness', () => {
  it('ensures all top-level translation sections match in Kannada and English', () => {
    const knKeys = Object.keys(knTranslations).sort();
    const enKeys = Object.keys(enTranslations).sort();
    expect(knKeys).toEqual(enKeys);
  });

  it('ensures all nested keys exist in both dictionaries', () => {
    for (const section of Object.keys(knTranslations) as (keyof typeof knTranslations)[]) {
      const knSubKeys = Object.keys(knTranslations[section]).sort();
      const enSubKeys = Object.keys(enTranslations[section]).sort();
      expect(knSubKeys).toEqual(enSubKeys);
    }
  });

  it('ensures no translation strings are empty', () => {
    for (const section of Object.keys(knTranslations) as (keyof typeof knTranslations)[]) {
      for (const [key, val] of Object.entries(knTranslations[section])) {
        expect((val as string).trim().length).toBeGreaterThan(0);
      }
      for (const [key, val] of Object.entries(enTranslations[section])) {
        expect((val as string).trim().length).toBeGreaterThan(0);
      }
    }
  });
});
