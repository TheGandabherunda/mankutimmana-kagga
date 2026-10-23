import React from 'react';
import { useRouter } from '../router';
import { useI18n } from '../i18n/context';
import { useBookmarks } from '../bookmarks/context';
import { KaggaCard } from '../components/KaggaCard';
import { Bookmark, Trash2, BookOpen } from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const { navigate } = useRouter();
  const { t } = useI18n();
  const { bookmarkedKaggas, clearAllBookmarks } = useBookmarks();

  const handleClear = () => {
    if (window.confirm(t.bookmarks.confirmClear)) {
      clearAllBookmarks();
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px 80px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 32,
          gap: 16,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 20,
        }}
      >
        <div>
          <h1
            className="kannada-text"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            {t.bookmarks.title}
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            {t.bookmarks.subtitle}
          </p>
        </div>

        {bookmarkedKaggas.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge" style={{ fontSize: '0.85rem' }}>
              {bookmarkedKaggas.length} {t.bookmarks.count}
            </span>
            <button
              onClick={handleClear}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#b91c1c' }}
            >
              <Trash2 size={15} />
              <span>{t.bookmarks.clearAll}</span>
            </button>
          </div>
        )}
      </div>

      {/* Bookmarks Content */}
      {bookmarkedKaggas.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'var(--bg-card)',
            maxWidth: 580,
            margin: '40px auto',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--forest-green-subtle)',
              color: 'var(--forest-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Bookmark size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            {t.bookmarks.emptyTitle}
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
            {t.bookmarks.emptyMessage}
          </p>
          <button
            onClick={() => navigate({ name: 'explore' })}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            <BookOpen size={18} />
            <span>{t.bookmarks.browseButton}</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {bookmarkedKaggas.map((kagga) => (
            <KaggaCard key={kagga.id} kagga={kagga} />
          ))}
        </div>
      )}
    </div>
  );
};
