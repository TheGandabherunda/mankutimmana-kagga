import React from 'react';
import { useI18n } from '../i18n/context';
import { BookOpen, ShieldCheck, Heart, Award, Feather, Scale, FileText } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { t, language } = useI18n();

  return (
    <div className="container-narrow" style={{ padding: '40px 20px 80px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <h1
          className="kannada-text"
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}
        >
          {t.about.title}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          {t.about.subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Section 1: Dr. D.V. Gundappa */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--forest-green-subtle)',
                color: 'var(--forest-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.about.dvgBioTitle}
            </h2>
          </div>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
            {t.about.dvgBio}
          </p>
        </section>

        {/* Section 2: Mankuthimmana Kagga */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--forest-green-subtle)',
                color: 'var(--forest-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.about.workTitle}
            </h2>
          </div>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
            {t.about.workDescription}
          </p>
        </section>

        {/* Section 3: Provenance & Dataset Origin */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--forest-green-subtle)',
                color: 'var(--forest-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.about.provenanceTitle}
            </h2>
          </div>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-primary)', marginBottom: 14 }}>
            {t.about.provenanceText}
          </p>
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
            }}
          >
            <strong>{language === 'kn' ? 'ಮೂಲ ದತ್ತಾಂಶ ಭಂಡಾರ:' : 'Source Dataset Provenance:'}</strong>{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}>
              https://github.com/rakeshmbgit/kagga-website
            </code>
          </div>
        </section>

        {/* Section 4: Copyright & Legal Notice */}
        <section
          className="card"
          style={{
            borderLeft: '4px solid var(--accent-gold)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(184, 134, 11, 0.12)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Scale size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.about.copyrightTitle}
            </h2>
          </div>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-primary)', marginBottom: 16 }}>
            {t.about.copyrightText}
          </p>
          <p style={{ fontSize: '0.94rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {t.about.disclaimerText}
          </p>
        </section>

        {/* Section 5: Open Source Software License */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--forest-green-subtle)',
                color: 'var(--forest-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.about.openSourceTitle}
            </h2>
          </div>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
            {t.about.openSourceText}
          </p>
        </section>
      </div>
    </div>
  );
};
