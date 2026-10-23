import React, { useState, useEffect, useRef, useDeferredValue } from 'react';
import { useRouter } from '../router';
import { useI18n } from '../i18n/context';
import { searchKaggas } from '../search/ranker';
import { SearchMatch } from '../types/kagga';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { navigate } = useRouter();
  const { t, language } = useI18n();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Defer query updates so typing remains buttery smooth at 60fps
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<SearchMatch[]>([]);

  useEffect(() => {
    if (deferredQuery.trim()) {
      const matches = searchKaggas(deferredQuery, 15);
      setResults(matches);
    } else {
      setResults([]);
    }
  }, [deferredQuery]);

  // Focus input and lock scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (id: number) => {
    navigate({ name: 'reader', id });
    onClose();
  };

  const sampleSuggestions = [
    { label: language === 'kn' ? 'ಕಗ್ಗ 789 (ಹುಲ್ಲಾಗು)' : 'Kagga 789 (Hullagu)', q: '789' },
    { label: language === 'kn' ? 'ಶ್ರೀ ವಿಷ್ಣು' : 'Sri Vishnu', q: 'ಶ್ರೀ ವಿಷ್ಣು' },
    { label: language === 'kn' ? 'ವೈರಾಗ್ಯ' : 'Detachment', q: 'Detachment' },
    { label: language === 'kn' ? 'ವಿಧಿ / ಕರ್ಮ' : 'Fate', q: 'Fate' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 16px 20px',
        backgroundColor: 'rgba(23, 28, 25, 0.75)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 640,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={20} color="var(--forest-green)" aria-hidden="true" />
          <h2 id="search-modal-title" className="visually-hidden">
            {t.common.searchAriaLabel}
          </h2>
          <input
            ref={inputRef}
            type="text"
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            aria-label={t.common.searchAriaLabel}
            style={{
              border: 'none',
              padding: 0,
              boxShadow: 'none',
              fontSize: '1.05rem',
              backgroundColor: 'transparent',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="btn-icon"
              style={{ width: 32, height: 32 }}
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: 32, height: 32 }}
            aria-label={t.common.close}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Container */}
        <div
          style={{
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {query.trim() === '' ? (
            /* Suggestions when query is empty */
            <div>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 10,
                }}
              >
                {language === 'kn' ? 'ಸೂಚಿಸಲಾದ ಹುಡುಕಾಟಗಳು' : 'Suggested Queries'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {sampleSuggestions.map((item) => (
                  <button
                    key={item.q}
                    onClick={() => setQuery(item.q)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: 36 }}
                  >
                    <Sparkles size={14} color="var(--forest-green)" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            /* No Results State */
            <div style={{ textAlign: 'center', padding: '36px 12px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                {t.explore.noResults}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto' }}>
                {t.explore.noResultsTip}
              </p>
            </div>
          ) : (
            /* Results List */
            results.map((match) => (
              <button
                key={match.kagga.id}
                onClick={() => handleSelect(match.kagga.id)}
                className="btn-ghost"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  width: '100%',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div className="badge badge-gold" style={{ fontSize: '0.78rem' }}>
                    {language === 'kn' ? `ಕಗ್ಗ #${match.kagga.id}` : `Kagga #${match.kagga.id}`}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {match.matchedFields.map((field) => (
                      <span
                        key={field}
                        style={{
                          fontSize: '0.7rem',
                          background: 'var(--forest-green-subtle)',
                          color: 'var(--forest-green)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="kannada-text"
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                  }}
                >
                  {match.kagga.kannadaText.split('\n')[0]}
                </div>

                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  {match.kagga.meaningInEnglish}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>{results.length > 0 ? `${results.length} ${t.explore.resultsCount}` : t.explore.searchHint}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span>Esc</span> {t.common.close}
          </span>
        </div>
      </div>
    </div>
  );
};
