import React, { useState, useEffect } from 'react';
import { useRouter } from './router';
import { useI18n } from './i18n/context';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { ReaderView } from './views/ReaderView';
import { BookmarksView } from './views/BookmarksView';
import { AboutView } from './views/AboutView';
import { ApiDocsView } from './views/ApiDocsView';

export const AppContent: React.FC = () => {
  const { route, navigate } = useRouter();
  const { t, language } = useI18n();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global hotkey '/' to open instant search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is already typing in an input or textarea
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveView = () => {
    switch (route.name) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'reader':
        return <ReaderView id={route.id} />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'about':
        return <AboutView />;
      case 'api-docs':
        return <ApiDocsView />;
      case 'not-found':
      default:
        return (
          <div className="container-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h1 className="kannada-text" style={{ fontSize: '2.5rem', marginBottom: 16 }}>
              {t.common.notFound}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '1.05rem' }}>
              {language === 'kn'
                ? 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟ ಅಥವಾ ಕಗ್ಗ ಕಂಡುಬಂದಿಲ್ಲ.'
                : 'The page or verse you are looking for was not found.'}
            </p>
            <button onClick={() => navigate({ name: 'home' })} className="btn btn-primary">
              {language === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : 'Return to Home'}
            </button>
          </div>
        );
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        {language === 'kn' ? 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ತೆರಳಿ (Skip to Content)' : 'Skip to main content'}
      </a>

      <Header onOpenSearch={() => setSearchModalOpen(true)} />

      <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
        {renderActiveView()}
      </main>

      <Footer />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};
