import { describe, it, expect } from 'vitest';
import { allKaggas, kaggaMap, getKaggaById, getPrevKagga, getNextKagga, TOTAL_KAGGAS } from '../src/data/kaggas';

describe('Kagga Dataset Integrity', () => {
  it('contains exactly 945 records', () => {
    expect(allKaggas.length).toBe(945);
    expect(TOTAL_KAGGAS).toBe(945);
    expect(kaggaMap.size).toBe(945);
  });

  it('has strictly sequential IDs from 1 to 945 without gaps or duplicates', () => {
    const ids = allKaggas.map((k) => k.id);
    const idSet = new Set(ids);

    expect(idSet.size).toBe(945);
    for (let i = 1; i <= 945; i++) {
      expect(ids[i - 1]).toBe(i);
      expect(kaggaMap.has(i)).toBe(true);
    }
  });

  it('has non-empty kannadaText and transliteration for every verse', () => {
    for (const kagga of allKaggas) {
      expect(kagga.kannadaText.trim().length).toBeGreaterThan(0);
      expect(kagga.transliteration.trim().length).toBeGreaterThan(0);
    }
  });

  it('has 100% complete meaningInEnglish across all 945 verses', () => {
    for (const kagga of allKaggas) {
      expect(kagga.meaningInEnglish.trim().length).toBeGreaterThan(0);
    }
  });

  it('accurately identifies verses missing Kannada meaning (IDs 3 and 883)', () => {
    const emptyKannadaMeaning = allKaggas.filter(
      (k) => !k.meaningInKannada || !k.meaningInKannada.trim()
    );
    expect(emptyKannadaMeaning.map((k) => k.id)).toEqual([3, 883]);
  });

  it('correctly handles getPrevKagga and getNextKagga bounds', () => {
    expect(getPrevKagga(1)).toBeNull();
    expect(getNextKagga(1)?.id).toBe(2);

    expect(getPrevKagga(945)?.id).toBe(944);
    expect(getNextKagga(945)).toBeNull();

    expect(getPrevKagga(42)?.id).toBe(41);
    expect(getNextKagga(42)?.id).toBe(43);
  });

  it('returns undefined for invalid IDs', () => {
    expect(getKaggaById(0)).toBeUndefined();
    expect(getKaggaById(946)).toBeUndefined();
    expect(getKaggaById(-1)).toBeUndefined();
    expect(getKaggaById(1.5)).toBeUndefined();
  });
});
