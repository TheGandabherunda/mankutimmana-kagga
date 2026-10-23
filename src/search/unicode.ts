/**
 * Unicode and Text Normalization for Kannada and Latin Scripts
 */

// Kannada digits to Arabic digits mapping
const KANNADA_DIGITS: Record<string, string> = {
  '೦': '0',
  '೧': '1',
  '೨': '2',
  '೩': '3',
  '೪': '4',
  '೫': '5',
  '೬': '6',
  '೭': '7',
  '೮': '8',
  '೯': '9',
};

/**
 * Normalizes Kannada numerals to standard digits
 */
export function convertKannadaNumerals(input: string): string {
  return input.replace(/[೦-೯]/g, (digit) => KANNADA_DIGITS[digit] || digit);
}

/**
 * Normalizes text for search matching:
 * - NFC Unicode normalization
 * - Converts Kannada digits
 * - Lowercases Latin characters
 * - Cleans up punctuation (including Kannada dandas '।', '॥')
 * - Collapses whitespace
 */
export function normalizeForSearch(text: string): string {
  if (!text) return '';

  return convertKannadaNumerals(text.normalize('NFC'))
    .toLowerCase()
    // Replace punctuation and symbols with space, keeping Kannada and Latin alphanumeric
    .replace(/[।॥.,\/#!$%\^&\*;:{}=\-_`~()'"?<>«»—–]/g, ' ')
    // Collapse consecutive whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits text into unique non-empty search tokens
 */
export function tokenize(text: string): string[] {
  const normalized = normalizeForSearch(text);
  if (!normalized) return [];
  return normalized.split(' ').filter((token) => token.length > 0);
}

/**
 * Checks if a query is formatted specifically as an ID query
 * e.g. "1", "#42", "kagga 100", "ಕಗ್ಗ ೧", "0", "9999"
 */
export function parseIdQuery(query: string): { isIdQuery: boolean; id: number | null } {
  const normalized = convertKannadaNumerals(query.trim().toLowerCase());
  const match = normalized.match(/^(?:#|kagga\s*|ಕಗ್ಗ\s*|k\s*|no\.?\s*)?(\d+)$/i);
  if (match) {
    const id = parseInt(match[1], 10);
    return { isIdQuery: true, id };
  }
  return { isIdQuery: false, id: null };
}
