import React, { createContext, useContext, useState, useEffect } from 'react';
import { Kagga } from '../types/kagga';
import { kaggaMap, MIN_KAGGA_ID, MAX_KAGGA_ID } from '../data/kaggas';

interface BookmarksContextValue {
  bookmarkedIds: number[];
  bookmarkedKaggas: Kagga[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (id: number) => void;
  removeBookmark: (id: number) => void;
  clearAllBookmarks: () => void;
}

const STORAGE_KEY = 'kagga_bookmarks_v1';

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter strictly to verified IDs (1 to 945)
        return parsed.filter(
          (id): id is number =>
            typeof id === 'number' &&
            Number.isInteger(id) &&
            id >= MIN_KAGGA_ID &&
            id <= MAX_KAGGA_ID
        );
      }
    } catch {
      // Graceful fallback if localStorage is disabled or corrupt
    }
    return [];
  });

  const saveIds = (ids: number[]) => {
    setBookmarkedIds(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Handle storage quota or private browsing exceptions
    }
  };

  const isBookmarked = (id: number): boolean => {
    return bookmarkedIds.includes(id);
  };

  const toggleBookmark = (id: number) => {
    if (id < MIN_KAGGA_ID || id > MAX_KAGGA_ID) return;
    if (bookmarkedIds.includes(id)) {
      saveIds(bookmarkedIds.filter((item) => item !== id));
    } else {
      saveIds([...bookmarkedIds, id]);
    }
  };

  const removeBookmark = (id: number) => {
    saveIds(bookmarkedIds.filter((item) => item !== id));
  };

  const clearAllBookmarks = () => {
    saveIds([]);
  };

  // Convert IDs to Kagga objects, preserving bookmarking order
  const bookmarkedKaggas = bookmarkedIds
    .map((id) => kaggaMap.get(id))
    .filter((k): k is Kagga => k !== undefined);

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIds,
        bookmarkedKaggas,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        clearAllBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export function useBookmarks(): BookmarksContextValue {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
