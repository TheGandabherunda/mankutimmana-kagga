/**
 * Golden Search Benchmark Test Set
 * All expected IDs are verified against data/kaggas-complete-945.ts
 */

export interface GoldenTestCase {
  id: string;
  category: string;
  query: string;
  expectedTopId?: number; // Must be the #1 result
  expectedInTop5?: number[]; // Must be within the top 5 results
  expectedInTop10?: number[]; // Must be within the top 10 results
  expectedCount?: number; // Exact count (e.g. 0 for no-results)
  mustHaveTheme?: string; // All returned results must contain this theme
}

export const GOLDEN_SEARCH_TEST_SET: GoldenTestCase[] = [
  // 1. Exact valid IDs
  {
    id: 'id-exact-1',
    category: 'Exact ID',
    query: '1',
    expectedTopId: 1,
  },
  {
    id: 'id-exact-42',
    category: 'Exact ID',
    query: '42',
    expectedTopId: 42,
  },
  {
    id: 'id-hash-prefix',
    category: 'Exact ID',
    query: '#789',
    expectedTopId: 789,
  },
  {
    id: 'id-text-prefix-en',
    category: 'Exact ID',
    query: 'Kagga 100',
    expectedTopId: 100,
  },
  {
    id: 'id-kannada-numeral-1',
    category: 'Exact ID',
    query: 'ಕಗ್ಗ ೧',
    expectedTopId: 1,
  },
  {
    id: 'id-kannada-numeral-789',
    category: 'Exact ID',
    query: '೭೮೯',
    expectedTopId: 789,
  },
  {
    id: 'id-bounds-945',
    category: 'Exact ID',
    query: '945',
    expectedTopId: 945,
  },

  // 2. Invalid IDs
  {
    id: 'id-invalid-0',
    category: 'Invalid ID',
    query: '0',
    expectedCount: 0,
  },
  {
    id: 'id-invalid-out-of-bounds',
    category: 'Invalid ID',
    query: '946',
    expectedCount: 0,
  },
  {
    id: 'id-invalid-large',
    category: 'Invalid ID',
    query: '#99999',
    expectedCount: 0,
  },

  // 3. Exact Kannada phrases
  {
    id: 'kn-phrase-1',
    category: 'Exact Kannada Phrase',
    query: 'ವಿಶ್ವಾದಿ ಮೂಲ',
    expectedTopId: 1,
  },
  {
    id: 'kn-phrase-2',
    category: 'Exact Kannada Phrase',
    query: 'ಜೀವ ಜಡರೂಪ',
    expectedTopId: 2,
  },
  {
    id: 'kn-phrase-789',
    category: 'Exact Kannada Phrase',
    query: 'ಹುಲ್ಲಾಗು ಬೆಟ್ಟದಡಿಯಲಿ',
    expectedTopId: 789,
  },
  {
    id: 'kn-phrase-3',
    category: 'Exact Kannada Phrase',
    query: 'ಇಹುದೊ ಇಲ್ಲವೊ ತಿಳಿಯಗೊಡದೊಂದು ವಸ್ತು',
    expectedTopId: 3,
  },

  // 4. Kannada words / partials
  {
    id: 'kn-word-mayalola',
    category: 'Kannada Word',
    query: 'ಮಾಯಾಲೋಲ',
    expectedInTop5: [1],
  },
  {
    id: 'kn-word-hullagu',
    category: 'Kannada Word',
    query: 'ಹುಲ್ಲಾಗು',
    expectedTopId: 789,
  },

  // 5. Transliteration queries
  {
    id: 'translit-sri-vishnu',
    category: 'Transliteration',
    query: 'Sri Vishnu vishvadi',
    expectedTopId: 1,
  },
  {
    id: 'translit-jadaroopa',
    category: 'Transliteration',
    query: 'jadaroopa',
    expectedTopId: 2,
  },

  // 6. English meaning queries
  {
    id: 'meaning-en-weaver',
    category: 'English Meaning',
    query: 'Weaver of this web of magic',
    expectedTopId: 1,
  },
  {
    id: 'meaning-en-penetrated',
    category: 'English Meaning',
    query: 'penetrated every object living or otherwise',
    expectedTopId: 2,
  },

  // 7. Punctuation & Whitespace variations
  {
    id: 'variation-whitespace',
    category: 'Punctuation/Whitespace',
    query: '   ಜೀವ    ಜಡರೂಪ   ',
    expectedTopId: 2,
  },
  {
    id: 'variation-dandas',
    category: 'Punctuation/Whitespace',
    query: 'ಶ್ರೀ ವಿಷ್ಣು । ಮಾಯಾಲೋಲ',
    expectedTopId: 1,
  },

  // 8. Theme query
  {
    id: 'theme-detachment',
    category: 'Theme Query',
    query: 'Detachment',
    expectedInTop10: [574, 613, 622],
    mustHaveTheme: 'Detachment',
  },

  // 9. Zero-result query
  {
    id: 'zero-results-nonsense',
    category: 'Zero Results',
    query: 'xyzqwerty987nonsensequery',
    expectedCount: 0,
  },
];
