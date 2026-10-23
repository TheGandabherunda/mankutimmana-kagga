/**
 * Core Domain Interfaces for Mankuthimmana Kagga
 */

export interface Kagga {
  id: number;
  kannadaText: string;
  transliteration: string;
  englishTranslation: string;
  meaningInEnglish: string;
  meaningInKannada: string;
  themes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type UILanguage = 'kn' | 'en';
export type ThemeMode = 'system' | 'light' | 'dark';

export interface SearchMatch {
  kagga: Kagga;
  score: number;
  matchedFields: ('id' | 'kannadaText' | 'transliteration' | 'meaningInEnglish' | 'meaningInKannada' | 'themes')[];
  snippet?: string;
}

export interface KaggaThemeInfo {
  key: string;
  nameKn: string;
  nameEn: string;
  count: number;
  descriptionKn: string;
  descriptionEn: string;
}

export interface PaginatedKaggaList {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: Kagga[];
}
