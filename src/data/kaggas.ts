import { completeKaggas } from '../../data/kaggas-complete-945';
import { Kagga, KaggaThemeInfo } from '../types/kagga';

// Frozen array of all 945 verified Kaggas in strict sequential order
export const allKaggas: readonly Kagga[] = Object.freeze(completeKaggas);

// O(1) ID lookup map
export const kaggaMap: ReadonlyMap<number, Kagga> = new Map(
  completeKaggas.map((k) => [k.id, Object.freeze(k)])
);

// Verified ID bounds
export const TOTAL_KAGGAS = allKaggas.length; // 945
export const MIN_KAGGA_ID = 1;
export const MAX_KAGGA_ID = 945;

/**
 * Get Kagga by numeric ID with O(1) lookup
 */
export function getKaggaById(id: number): Kagga | undefined {
  if (id < MIN_KAGGA_ID || id > MAX_KAGGA_ID || !Number.isInteger(id)) {
    return undefined;
  }
  return kaggaMap.get(id);
}

/**
 * Get adjacent verses safely
 */
export function getPrevKagga(currentId: number): Kagga | null {
  return currentId > MIN_KAGGA_ID ? (kaggaMap.get(currentId - 1) ?? null) : null;
}

export function getNextKagga(currentId: number): Kagga | null {
  return currentId < MAX_KAGGA_ID ? (kaggaMap.get(currentId + 1) ?? null) : null;
}

/**
 * Get a random Kagga from the verified collection
 */
export function getRandomKagga(): Kagga {
  const randomIndex = Math.floor(Math.random() * TOTAL_KAGGAS);
  return allKaggas[randomIndex];
}

/**
 * Theme metadata and bilingual titles
 */
export const THEME_METADATA: Record<string, { kn: string; en: string; descKn: string; descEn: string }> = {
  Wisdom: {
    kn: 'ಜ್ಞಾನ / ವಿವೇಕ',
    en: 'Wisdom',
    descKn: 'ಜ್ಞಾನ, ಚಿಂತನೆ ಮತ್ತು ಜೀವನದ ನಿಗೂಢ ಸತ್ಯಗಳ ದರ್ಶನ.',
    descEn: 'Insights into cosmic truth, perception, and philosophical clarity.',
  },
  Life: {
    kn: 'ಜೀವನ / ಬದುಕು',
    en: 'Life',
    descKn: 'ಜೀವನದ ಏಳು-ಬೀಳುಗಳು, ಸಂಕಷ್ಟ ಮತ್ತು ಬದುಕಿನ ರಹಸ್ಯ.',
    descEn: 'The multifaceted journey of living, endurance, and human experience.',
  },
  Devotion: {
    kn: 'ಭಕ್ತಿ / ಶರಣಾಗತಿ',
    en: 'Devotion',
    descKn: 'ವಿಶ್ವಾತ್ಮ ಮತ್ತು ಸೃಷ್ಟಿಕರ್ತನ ಮುಂದೆ ವಿನಮ್ರ ಶರಣಾಗತಿ.',
    descEn: 'Humility and surrender to the supreme mystery of creation.',
  },
  Detachment: {
    kn: 'ವೈರಾಗ್ಯ',
    en: 'Detachment',
    descKn: 'ಆಸೆ-ಆಮಿಷಗಳಿಂದ ಮುಕ್ತಿ ಮತ್ತು ಅನಾಸಕ್ತಿ ಭಾವ.',
    descEn: 'Freedom from transient desires and cultivating equanimity.',
  },
  Fate: {
    kn: 'ವಿಧಿ / ಕರ್ಮ',
    en: 'Fate & Karma',
    descKn: 'ಅನಿವಾರ್ಯ ವಿಧಿಯ ಲೀಲೆ ಮತ್ತು ಕರ್ಮಫಲದ ಸ್ವೀಕಾರ.',
    descEn: 'Acceptance of inevitable destiny and the unfolding of life.',
  },
  Duty: {
    kn: 'ಕರ್ತವ್ಯ / ಧರ್ಮ',
    en: 'Duty',
    descKn: 'ಜಗತ್ತಿನಲ್ಲಿ ನಮ್ಮ ಪಾಲಿನ ಕೆಲಸವನ್ನು ನಿಷ್ಠೆಯಿಂದ ಮಾಡುವುದು.',
    descEn: 'Right action, civic responsibility, and moral obligation.',
  },
  Peace: {
    kn: 'ಶಾಂತಿ / ನೆಮ್ಮದಿ',
    en: 'Peace',
    descKn: 'ಮನಸ್ಸಿನ ಶಾಂತಿ ಮತ್ತು ಅಂತರಂಗದ ಸಮಾಧಾನ.',
    descEn: 'Inner tranquility, quietness of mind, and contentment.',
  },
  Self: {
    kn: 'ಆತ್ಮ / ಅಂತರಂಗ',
    en: 'Self & Soul',
    descKn: 'ತನ್ನನ್ನು ತಾನು ಅರಿಯುವುದು ಮತ್ತು ಅಂತರಾತ್ಮನ ಅನ್ವೇಷಣೆ.',
    descEn: 'Self-realization, introspection, and personal integrity.',
  },
  Nature: {
    kn: 'ಪ್ರಕೃತಿ',
    en: 'Nature',
    descKn: 'ಸೃಷ್ಟಿಯ ಸೌಂದರ್ಯ, ಜಗತ್ತಿನ ನಿಯಮಗಳು ಮತ್ತು ವಿಶ್ವದ ವಿಸ್ಮಯ.',
    descEn: 'The awe of creation, seasonal rhythms, and universal laws.',
  },
  Morality: {
    kn: 'ನೀತಿ / ಸದಾಚಾರ',
    en: 'Morality & Ethics',
    descKn: 'ಸತ್ವರ್ತನೆ, ನ್ಯಾಯ ಮತ್ತು ಮಾನವೀಯ ಮೌಲ್ಯಗಳು.',
    descEn: 'Ethical conduct, truthfulness, and human dignity.',
  },
  Society: {
    kn: 'ಸಮಾಜ / ಲೋಕ',
    en: 'Society',
    descKn: 'ಲೋಕದ ನಡವಳಿಕೆ, ಮಾನವ ಸ್ವಭಾವ ಮತ್ತು ಸಾಮೂಹಿಕ ಬದುಕು.',
    descEn: 'Social dynamics, human foibles, and living in community.',
  },
  Suffering: {
    kn: 'ದುಃಖ / ಸಂಕಟ',
    en: 'Suffering',
    descKn: 'ಕಷ್ಟ-ನೋವುಗಳ ಸಹನೆ ಮತ್ತು ದುಃಖದಿಂದ ಕಲಿಯುವ ಪಾಠ.',
    descEn: 'Enduring pain, grief, and spiritual resilience in adversity.',
  },
  Love: {
    kn: 'ಪ್ರೀತಿ / ಕರುಣೆ',
    en: 'Love & Compassion',
    descKn: 'ಸಕಲ ಜೀವರಾಶಿಗಳಲ್ಲಿ ದಯೆ, ಸ್ನೇಹ ಮತ್ತು ವಾತ್ಸಲ್ಯ.',
    descEn: 'Kindness, fellowship, and unconditional compassion.',
  },
  Death: {
    kn: 'ಮರಣ / ಅಂತಿಮ ಸತ್ಯ',
    en: 'Death & Mortality',
    descKn: 'ಮರಣದ ಅನಿವಾರ್ಯತೆ ಮತ್ತು ನಶ್ವರತೆಯ ನೆನಪು.',
    descEn: 'The inevitability of mortality and cosmic dissolution.',
  },
  War: {
    kn: 'ಸಂಘರ್ಷ / ಯುದ್ಧ',
    en: 'Struggle & Conflict',
    descKn: 'ಬದುಕಿನ ಹೋರಾಟ ಮತ್ತು ಧರ್ಮ-ಅಧರ್ಮದ ಯುದ್ಧ.',
    descEn: 'The inner and outer struggle against darkness and injustice.',
  },
};

/**
 * Get all available themes with counts
 */
export function getAllThemes(): KaggaThemeInfo[] {
  const counts: Record<string, number> = {};
  for (const kagga of allKaggas) {
    for (const theme of kagga.themes) {
      counts[theme] = (counts[theme] || 0) + 1;
    }
  }

  return Object.entries(THEME_METADATA).map(([key, meta]) => ({
    key,
    nameKn: meta.kn,
    nameEn: meta.en,
    count: counts[key] || 0,
    descriptionKn: meta.descKn,
    descriptionEn: meta.descEn,
  }));
}

/**
 * Filter Kaggas by theme
 */
export function getKaggasByTheme(theme: string): Kagga[] {
  const normalized = theme.trim().toLowerCase();
  return allKaggas.filter((k) =>
    k.themes.some((t) => t.toLowerCase() === normalized)
  );
}
