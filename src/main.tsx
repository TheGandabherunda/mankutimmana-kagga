import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './theme/context';
import { I18nProvider } from './i18n/context';
import { BookmarksProvider } from './bookmarks/context';
import { RouterProvider } from './router';
import { AppContent } from './App';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <BookmarksProvider>
          <RouterProvider>
            <AppContent />
          </RouterProvider>
        </BookmarksProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
);
