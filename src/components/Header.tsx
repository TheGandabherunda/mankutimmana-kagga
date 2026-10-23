import React, { useState } from 'react';
import { useRouter } from '../router';
import { useI18n } from '../i18n/context';
import { useTheme } from '../theme/context';
import { useBookmarks } from '../bookmarks/context';
import {
  Search,
  Bookmark,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Languages,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { route, navigate } = useRouter();
  const { t, language, toggleLanguage } = useI18n();
  const { themeMode, cycleTheme } = useTheme();
  const { bookmarkedIds } = useBookmarks();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (name: string): boolean => {
    return route.name === name;
  };

  const navItems = [
    { name: 'home', label: t.nav.reflect },
    { name: 'explore', label: t.nav.explore },
    {
      name: 'bookmarks',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {t.nav.bookmarks}
          {bookmarkedIds.length > 0 && (
            <span
              style={{
                background: 'var(--forest-green)',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '1px 6px',
                borderRadius: '999px',
                fontWeight: 600,
              }}
            >
              {bookmarkedIds.length}
            </span>
          )}
        </span>
      ),
    },
    { name: 'about', label: t.nav.about },
    { name: 'api-docs', label: t.nav.api },
  ];

  const handleNavClick = (name: string) => {
    navigate({ name } as any);
    setMobileMenuOpen(false);
  };

  const renderThemeIcon = () => {
    if (themeMode === 'light') return <Sun size={18} aria-hidden="true" />;
    if (themeMode === 'dark') return <Moon size={18} aria-hidden="true" />;
    return <Monitor size={18} aria-hidden="true" />;
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
        {/* Brand / Logo */}
        <button
          onClick={() => navigate({ name: 'home' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textAlign: 'left',
            padding: '6px 0',
          }}
          aria-label={t.common.siteTitle}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--forest-green)',
              color: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <BookOpen size={20} aria-hidden="true" />
          </div>
          <div>
            <div
              className="kannada-text"
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {t.common.siteTitle}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {t.common.author}
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          style={{ display: 'none' }}
          className="desktop-nav"
          aria-label="Main Navigation"
        >
          <ul style={{ display: 'flex', listStyle: 'none', gap: 6, alignItems: 'center' }}>
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.name)}
                  className={`btn btn-ghost ${isActive(item.name) ? 'active-nav-link' : ''}`}
                  style={{
                    color: isActive(item.name) ? 'var(--forest-green)' : 'var(--text-secondary)',
                    fontWeight: isActive(item.name) ? 600 : 500,
                    borderBottom: isActive(item.name) ? '2px solid var(--forest-green)' : '2px solid transparent',
                    borderRadius: 0,
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Controls: Search, Language, Theme, Mobile toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.9rem', gap: 6 }}
            aria-label={t.common.searchAriaLabel}
          >
            <Search size={16} aria-hidden="true" />
            <span className="search-text-desktop">{t.nav.search}</span>
            <kbd
              style={{
                fontSize: '0.72rem',
                padding: '2px 5px',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                color: 'var(--text-muted)',
              }}
            >
              /
            </kbd>
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="btn-icon"
            title={`Switch to ${language === 'kn' ? 'English' : 'ಕನ್ನಡ'}`}
            aria-label={`Switch to ${language === 'kn' ? 'English' : 'ಕನ್ನಡ'}`}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-ui)' }}>
              {language === 'kn' ? 'EN' : 'ಕ'}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={cycleTheme}
            className="btn-icon"
            title={`${t.common.themeMode}: ${themeMode}`}
            aria-label={`${t.common.themeMode}: ${themeMode}`}
          >
            {renderThemeIcon()}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon mobile-only"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            padding: '16px 20px',
          }}
          className="mobile-drawer"
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.name)}
                  className="btn btn-ghost"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    color: isActive(item.name) ? 'var(--forest-green)' : 'var(--text-primary)',
                    fontWeight: isActive(item.name) ? 600 : 500,
                    backgroundColor: isActive(item.name) ? 'var(--forest-green-subtle)' : 'transparent',
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Responsive helper styles */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
          .mobile-only { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
        @media (max-width: 767px) {
          .search-text-desktop { display: none; }
        }
      `}</style>
    </header>
  );
};
