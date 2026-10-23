import React, { useMemo } from 'react';
import { useRouter } from '../router';
import { useI18n } from '../i18n/context';
import { allKaggas, getAllThemes, getKaggaById, TOTAL_KAGGAS } from '../data/kaggas';
import { KaggaCard } from '../components/KaggaCard';
import { BookOpen, Sparkles, Compass, Shuffle, Bookmark, ArrowRight, Sun } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language } = useI18n();

  // Deterministic Kagga of the Day based on day of year
  const dailyKagga = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    // Map day of year to 1..945 range
    const kaggaId = (dayOfYear % TOTAL_KAGGAS) + 1;
    return getKaggaById(kaggaId) || allKaggas[0];
  }, []);

  const themes = useMemo(() => getAllThemes().slice(0, 8), []);

  const handleRandomClick = () => {
    const randomId = Math.floor(Math.random() * TOTAL_KAGGAS) + 1;
    navigate({ name: 'reader', id: randomId });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 64, padding: '40px 0 80px' }}>
      {/* Hero Section */}
      <section className="container-narrow" style={{ textAlign: 'center' }}>
        <div
          className="badge badge-gold"
          style={{ marginBottom: 20, padding: '6px 14px', fontSize: '0.85rem' }}
        >
          <Sparkles size={14} aria-hidden="true" />
          <span>{t.home.welcomeBadge}</span>
        </div>

        <h1
          className="kannada-text"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}
        >
          {t.home.heroTitle}
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: 24,
            fontWeight: 500,
          }}
        >
          {t.home.heroSubtitle}
        </p>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: 620,
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}
        >
          {t.home.heroIntro}
        </p>

        {/* Primary CTA Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => navigate({ name: 'explore' })}
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '1.05rem' }}
          >
            <BookOpen size={18} aria-hidden="true" />
            <span>{t.home.exploreButton}</span>
          </button>

          <button
            onClick={handleRandomClick}
            className="btn btn-secondary"
            style={{ padding: '12px 24px', fontSize: '1.05rem' }}
          >
            <Shuffle size={18} aria-hidden="true" />
            <span>{t.home.randomButton}</span>
          </button>
        </div>
      </section>

      {/* Kagga of the Day Section */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            className="badge"
            style={{ marginBottom: 8, fontSize: '0.8rem' }}
          >
            <Sun size={14} aria-hidden="true" />
            <span>{t.home.dailyKaggaBadge}</span>
          </div>
          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {t.home.dailyKaggaTitle}
          </h2>
        </div>

        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <KaggaCard kagga={dailyKagga} showMeaning={true} />
        </div>
      </section>

      {/* Explore by Theme Grid */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {t.home.themesTitle}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              {t.home.themesSubtitle}
            </p>
          </div>
          <button
            onClick={() => navigate({ name: 'explore' })}
            className="btn btn-ghost"
            style={{ gap: 6, fontWeight: 600, color: 'var(--forest-green)' }}
          >
            <span>{language === 'kn' ? 'ಎಲ್ಲ ವಿಷಯಗಳು' : 'All Themes'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {themes.map((theme) => (
            <button
              key={theme.key}
              onClick={() => navigate({ name: 'explore', theme: theme.key })}
              className="card"
              style={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                  className="kannada-text"
                >
                  {language === 'kn' ? theme.nameKn : theme.nameEn}
                </span>
                <span className="badge" style={{ fontSize: '0.75rem' }}>
                  {theme.count}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {language === 'kn' ? theme.descriptionKn : theme.descriptionEn}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
