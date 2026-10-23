import React, { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { useRouter } from '../router';
import { useI18n } from '../i18n/context';
import { allKaggas, getAllThemes } from '../data/kaggas';
import { searchKaggas } from '../search/ranker';
import { KaggaCard } from '../components/KaggaCard';
import { Search, Filter, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export const ExploreView: React.FC = () => {
  const { route, navigate } = useRouter();
  const { t, language } = useI18n();

  // Extract initial params from route
  const initialTheme = (route.name === 'explore' && route.theme) || '';
  const initialQuery = (route.name === 'explore' && route.query) || '';
  const initialPage = (route.name === 'explore' && route.page) || 1;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Synchronize when route updates externally
  useEffect(() => {
    if (route.name === 'explore') {
      if (route.theme !== undefined) setSelectedTheme(route.theme);
      if (route.query !== undefined) setSearchQuery(route.query);
      if (route.page !== undefined) setCurrentPage(route.page);
    }
  }, [route]);

  const themes = useMemo(() => getAllThemes(), []);

  // Defer query updates so typing remains smooth
  const deferredQuery = useDeferredValue(searchQuery);

  // Derived filtered results during rendering (No redundant useEffect renders)
  const filteredKaggas = useMemo(() => {
    let pool = allKaggas;

    // Apply search query first if provided
    if (deferredQuery.trim()) {
      const searchMatches = searchKaggas(deferredQuery, 945);
      pool = searchMatches.map((m) => m.kagga);
    }

    // Apply theme filter if selected
    if (selectedTheme) {
      pool = pool.filter((k) =>
        k.themes.some((t) => t.toLowerCase() === selectedTheme.toLowerCase())
      );
    }

    return pool;
  }, [deferredQuery, selectedTheme]);

  // Reset page when filter or query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [deferredQuery, selectedTheme]);

  const totalPages = Math.max(1, Math.ceil(filteredKaggas.length / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentVerses = filteredKaggas.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    navigate({
      name: 'explore',
      theme: selectedTheme || undefined,
      query: searchQuery || undefined,
      page: newPage,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleThemeSelect = (themeKey: string) => {
    const nextTheme = selectedTheme === themeKey ? '' : themeKey;
    setSelectedTheme(nextTheme);
    navigate({
      name: 'explore',
      theme: nextTheme || undefined,
      query: searchQuery || undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTheme('');
    setCurrentPage(1);
    navigate({ name: 'explore', page: 1 });
  };

  return (
    <div className="container" style={{ padding: '36px 20px 80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1
          className="kannada-text"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          {t.explore.title}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          {t.explore.subtitle}
        </p>
      </div>

      {/* Search Input Bar */}
      <div
        style={{
          position: 'relative',
          maxWidth: 680,
          margin: '0 auto 28px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        >
          <Search size={20} aria-hidden="true" />
        </div>
        <input
          type="text"
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.common.searchPlaceholder}
          aria-label={t.common.searchAriaLabel}
          style={{
            paddingLeft: 48,
            paddingRight: searchQuery ? 44 : 16,
            fontSize: '1rem',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="btn-icon"
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 32,
              height: 32,
              border: 'none',
              background: 'transparent',
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Theme Filter Horizontal Scrollable Bar */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => handleThemeSelect('')}
            className={`btn ${selectedTheme === '' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '6px 14px', minHeight: 36 }}
          >
            {t.explore.allThemes} ({allKaggas.length})
          </button>

          {themes.map((theme) => {
            const isSelected = selectedTheme.toLowerCase() === theme.key.toLowerCase();
            return (
              <button
                key={theme.key}
                onClick={() => handleThemeSelect(theme.key)}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '6px 14px', minHeight: 36 }}
              >
                <span>{language === 'kn' ? theme.nameKn : theme.nameEn}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    opacity: 0.8,
                    marginLeft: 2,
                  }}
                >
                  ({theme.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header: Count and Clear Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 12,
        }}
      >
        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          <strong>{filteredKaggas.length}</strong> {t.explore.resultsCount}
          {selectedTheme && (
            <span style={{ marginLeft: 6 }}>
              ({t.explore.filterByTheme}: <strong>{selectedTheme}</strong>)
            </span>
          )}
        </div>

        {(searchQuery || selectedTheme) && (
          <button
            onClick={handleClearFilters}
            className="btn btn-ghost"
            style={{ fontSize: '0.85rem', padding: '4px 8px', color: 'var(--forest-green)' }}
          >
            <X size={14} />
            <span>{t.explore.clearFilter}</span>
          </button>
        )}
      </div>

      {/* Verses Grid */}
      {filteredKaggas.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            {t.explore.noResults}
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 24px' }}>
            {t.explore.noResultsTip}
          </p>
          <button onClick={handleClearFilters} className="btn btn-primary">
            {t.explore.clearFilter}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
            marginBottom: 48,
          }}
        >
          {currentVerses.map((kagga) => (
            <KaggaCard key={kagga.id} kagga={kagga} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            marginTop: 40,
          }}
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="btn btn-secondary"
            style={{
              opacity: currentPage <= 1 ? 0.4 : 1,
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            }}
            aria-label={t.explore.previous}
          >
            <ChevronLeft size={18} />
            <span>{t.explore.previous}</span>
          </button>

          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {t.explore.page} {currentPage} {t.explore.of} {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="btn btn-secondary"
            style={{
              opacity: currentPage >= totalPages ? 0.4 : 1,
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            }}
            aria-label={t.explore.next}
          >
            <span>{t.explore.next}</span>
            <ChevronRight size={18} />
          </button>
        </nav>
      )}
    </div>
  );
};
