import { allKaggas, kaggaMap, MIN_KAGGA_ID, MAX_KAGGA_ID } from '../data/kaggas';
import { Kagga, SearchMatch } from '../types/kagga';
import { parseIdQuery, normalizeForSearch, tokenize } from './unicode';

interface IndexedKagga {
  kagga: Kagga;
  normKannada: string;
  normTranslit: string;
  normMeaningEn: string;
  normMeaningKn: string;
  normThemes: string[];
  kannadaTokens: Set<string>;
  translitTokens: Set<string>;
  meaningEnTokens: Set<string>;
  meaningKnTokens: Set<string>;
}

// Pre-indexed in-memory data for fast local client-side search (<10ms)
const indexedCollection: IndexedKagga[] = allKaggas.map((kagga) => {
  const normKannada = normalizeForSearch(kagga.kannadaText);
  const normTranslit = normalizeForSearch(kagga.transliteration);
  const normMeaningEn = normalizeForSearch(kagga.meaningInEnglish);
  const normMeaningKn = normalizeForSearch(kagga.meaningInKannada);
  const normThemes = kagga.themes.map((t) => normalizeForSearch(t));

  return {
    kagga,
    normKannada,
    normTranslit,
    normMeaningEn,
    normMeaningKn,
    normThemes,
    kannadaTokens: new Set(normKannada.split(' ').filter(Boolean)),
    translitTokens: new Set(normTranslit.split(' ').filter(Boolean)),
    meaningEnTokens: new Set(normMeaningEn.split(' ').filter(Boolean)),
    meaningKnTokens: new Set(normMeaningKn.split(' ').filter(Boolean)),
  };
});

/**
 * Searches the Kagga collection with transparent ranking and snippet generation
 */
export function searchKaggas(query: string, maxResults: number = 30): SearchMatch[] {
  const rawQuery = query.trim();
  if (!rawQuery) return [];

  // Check 1: Dedicated ID query (e.g. "1", "#42", "ಕಗ್ಗ ೧", "Kagga 100", "0", "946")
  const { isIdQuery, id } = parseIdQuery(rawQuery);
  if (isIdQuery) {
    if (id !== null && id >= MIN_KAGGA_ID && id <= MAX_KAGGA_ID) {
      const directMatch = kaggaMap.get(id);
      if (directMatch) {
        return [
          {
            kagga: directMatch,
            score: 10000,
            matchedFields: ['id'],
            snippet: directMatch.kannadaText.split('\n')[0],
          },
        ];
      }
    }
    // Out-of-bounds or non-existent ID
    return [];
  }

  const normalizedQuery = normalizeForSearch(rawQuery);
  if (!normalizedQuery) return [];

  const queryTokens = tokenize(normalizedQuery);
  if (queryTokens.length === 0) return [];

  const results: SearchMatch[] = [];

  for (const item of indexedCollection) {
    let score = 0;
    const matchedFieldsSet = new Set<SearchMatch['matchedFields'][number]>();
    let matchedSnippet = '';

    // Check 2: Exact Phrase Match
    if (item.normKannada.includes(normalizedQuery)) {
      score += 1200;
      matchedFieldsSet.add('kannadaText');
      if (!matchedSnippet) matchedSnippet = item.kagga.kannadaText.split('\n')[0];
    }

    if (item.normTranslit.includes(normalizedQuery)) {
      score += 700;
      matchedFieldsSet.add('transliteration');
      if (!matchedSnippet) matchedSnippet = item.kagga.transliteration.split('\n')[0];
    }

    if (item.normMeaningEn.includes(normalizedQuery)) {
      score += 600;
      matchedFieldsSet.add('meaningInEnglish');
      if (!matchedSnippet) matchedSnippet = item.kagga.meaningInEnglish;
    }

    if (item.normMeaningKn.includes(normalizedQuery)) {
      score += 550;
      matchedFieldsSet.add('meaningInKannada');
      if (!matchedSnippet) matchedSnippet = item.kagga.meaningInKannada;
    }

    // Check 3: Theme matches
    for (const theme of item.normThemes) {
      if (theme.includes(normalizedQuery)) {
        score += 300;
        matchedFieldsSet.add('themes');
      }
    }

    // Check 4: Token-level matching across fields
    let tokensMatched = 0;
    for (const token of queryTokens) {
      let tokenFound = false;

      if (item.kannadaTokens.has(token)) {
        score += 150;
        matchedFieldsSet.add('kannadaText');
        tokenFound = true;
      } else if (item.normKannada.includes(token)) {
        score += 60;
        matchedFieldsSet.add('kannadaText');
        tokenFound = true;
      }

      if (item.translitTokens.has(token)) {
        score += 80;
        matchedFieldsSet.add('transliteration');
        tokenFound = true;
      } else if (item.normTranslit.includes(token)) {
        score += 35;
        matchedFieldsSet.add('transliteration');
        tokenFound = true;
      }

      if (item.meaningEnTokens.has(token)) {
        score += 70;
        matchedFieldsSet.add('meaningInEnglish');
        tokenFound = true;
      } else if (item.normMeaningEn.includes(token)) {
        score += 30;
        matchedFieldsSet.add('meaningInEnglish');
        tokenFound = true;
      }

      if (item.meaningKnTokens.has(token)) {
        score += 65;
        matchedFieldsSet.add('meaningInKannada');
        tokenFound = true;
      } else if (item.normMeaningKn.includes(token)) {
        score += 25;
        matchedFieldsSet.add('meaningInKannada');
        tokenFound = true;
      }

      for (const theme of item.normThemes) {
        if (theme.includes(token)) {
          score += 40;
          matchedFieldsSet.add('themes');
          tokenFound = true;
          break;
        }
      }

      if (tokenFound) tokensMatched++;
    }

    // Multi-word full match bonus
    if (queryTokens.length > 1 && tokensMatched === queryTokens.length) {
      score += 200;
    }

    if (score > 0) {
      results.push({
        kagga: item.kagga,
        score,
        matchedFields: Array.from(matchedFieldsSet),
        snippet: matchedSnippet || item.kagga.kannadaText.split('\n')[0],
      });
    }
  }

  // Sort descending by score, tie-break by Kagga ID ascending
  results.sort((a, b) => b.score - a.score || a.kagga.id - b.kagga.id);

  return results.slice(0, maxResults);
}
