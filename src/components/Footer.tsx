import React from 'react';
import { useRouter } from '../router';
import { useI18n } from '../i18n/context';
import { BookOpen, Code, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language } = useI18n();

  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '48px 0 32px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 36,
            marginBottom: 40,
          }}
        >
          {/* Col 1: About the Work */}
          <div>
            <div
              className="kannada-text"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}
            >
              {t.common.siteTitle}
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 16 }}>
              {language === 'kn'
                ? 'ಡಾ. ಡಿ. ವಿ. ಗುಂಡಪ್ಪನವರು (ಡಿವಿಜಿ) ರಚಿಸಿದ ೯೪೫ ಮುಕ್ತಕಗಳ ಅಮೃತ ಚಿಂತನೆ. ಮಾನವೀಯ ಮೌಲ್ಯ, ಕರ್ತವ್ಯ ಮತ್ತು ಸತ್ಯದ ಅನ್ವೇಷಣೆಗೆ ನಿತ್ಯ ದೀವಿಗೆ.'
                : '945 contemplative verses on life, duty, detached wisdom, and the cosmic mystery composed by Dr. D. V. Gundappa.'}
            </p>
            <div className="badge badge-gold" style={{ fontSize: '0.8rem' }}>
              <BookOpen size={14} aria-hidden="true" />
              <span>{language === 'kn' ? '೧೯೪೩ – ಶಾಶ್ವತ ಸಾಹಿತ್ಯ ನಿಧಿ' : 'First Published in 1943'}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {language === 'kn' ? 'ವಿಭಾಗಗಳು' : 'Sections'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>
                <button
                  onClick={() => navigate({ name: 'home' })}
                  className="btn-ghost"
                  style={{ padding: 0, fontSize: '0.92rem' }}
                >
                  {t.nav.reflect}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'explore' })}
                  className="btn-ghost"
                  style={{ padding: 0, fontSize: '0.92rem' }}
                >
                  {t.nav.explore}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'bookmarks' })}
                  className="btn-ghost"
                  style={{ padding: 0, fontSize: '0.92rem' }}
                >
                  {t.nav.bookmarks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'about' })}
                  className="btn-ghost"
                  style={{ padding: 0, fontSize: '0.92rem' }}
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'api-docs' })}
                  className="btn-ghost"
                  style={{ padding: 0, fontSize: '0.92rem' }}
                >
                  {t.nav.api}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Provenance & Legal notice */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {language === 'kn' ? 'ಕೃತಿಸ್ವಾಮ್ಯ ಮತ್ತು ಗೌರವ' : 'Copyright & Provenance'}
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 12 }}>
              {language === 'kn'
                ? 'ಡಿವಿಜಿಯವರ ಸಾಹಿತ್ಯ ಕೃತಿಗಳ ಕೃತಿಸ್ವಾಮ್ಯವು ಭಾರತೀಯ ಕೃತಿಸ್ವಾಮ್ಯ ಕಾಯ್ದೆಯನ್ವಯ ೨೦೩೬ರವರೆಗೆ ಜಾರಿಯಲ್ಲಿದೆ. ಈ ತಾಣವು ಲಾಭರಹಿತ ಸಾಂಸ್ಕೃತಿಕ, ಶೈಕ್ಷಣಿಕ ಅಧ್ಯಯನಕ್ಕೆ ಮಾತ್ರ ಮೀಸಲಾಗಿದೆ.'
                : 'DVG\'s literary works remain protected under Indian copyright law until January 1, 2036. This non-commercial library is dedicated strictly to cultural, educational study and preservation.'}
            </p>
            <button
              onClick={() => navigate({ name: 'about' })}
              style={{
                fontSize: '0.85rem',
                color: 'var(--forest-green)',
                textDecoration: 'underline',
                fontWeight: 500,
              }}
            >
              {language === 'kn' ? 'ಸಂಪೂರ್ಣ ಕೃತಿಸ್ವಾಮ್ಯ ವಿವರಗಳನ್ನು ಓದಿ' : 'Read full copyright & provenance disclosure'}
            </button>
          </div>
        </div>

        {/* Bottom divider and credits */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            {language === 'kn' ? (
              <span>ಕನ್ನಡ ಸಾಹಿತ್ಯ ಪ್ರೇಮಿಗಳಿಗಾಗಿ ಗೌರವಪೂರ್ವಕ ಅರ್ಪಣೆ</span>
            ) : (
              <span>Dedicated with reverent care to readers and seekers of Kannada literature</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Code size={14} aria-hidden="true" />
              <span>MIT Software License</span>
            </span>
          </div>
        </div>

        {/* Subtle Creator Attribution */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Made with{' '}
            <span
              style={{
                color: 'var(--accent-terracotta)',
                display: 'inline-block',
                margin: '0 2px',
              }}
              aria-label="love"
              role="img"
            >
              ♥
            </span>{' '}
            by{' '}
            <a
              href="https://github.com/TheGandabherunda"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-creator-link"
              aria-label="TheGandabherunda on GitHub (opens in a new tab)"
            >
              TheGandabherunda
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

