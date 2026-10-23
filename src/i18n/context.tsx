import React, { createContext, useContext, useState, useEffect } from 'react';
import { UILanguage } from '../types/kagga';
import { knTranslations } from './kn';
import { enTranslations } from './en';
import { TranslationSchema } from './types';

interface I18nContextValue {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  toggleLanguage: () => void;
  t: TranslationSchema;
}

const STORAGE_KEY = 'kagga_ui_lang';

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<UILanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'kn') return saved;
    } catch {
      // localStorage may be unavailable
    }
    // Default to Kannada for first-time visitors as specified
    return 'kn';
  });

  const setLanguage = (lang: UILanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore quota or disabled errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'kn' ? 'en' : 'kn');
  };

  // Keep HTML lang attribute synchronized
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = language === 'kn' ? knTranslations : enTranslations;

  return (
    <I18nContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
