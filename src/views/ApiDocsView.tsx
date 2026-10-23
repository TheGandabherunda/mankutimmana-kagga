import React from 'react';
import { useI18n } from '../i18n/context';
import { Code, Terminal, Server, Check, Copy } from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const { t, language } = useI18n();

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mankutimmana-kagga.com';

  return (
    <div className="container-narrow" style={{ padding: '40px 20px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div className="badge badge-gold" style={{ marginBottom: 12 }}>
          <Code size={14} aria-hidden="true" />
          <span>v1.0.0 Static REST API</span>
        </div>
        <h1
          className="kannada-text"
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}
        >
          {t.api.title}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          {t.api.subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Overview */}
        <section className="card">
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            {t.api.overviewTitle}
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: 16 }}>
            {t.api.overviewText}
          </p>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              color: 'var(--forest-green)',
              fontWeight: 600,
            }}
          >
            Base URL: {baseUrl}/api/v1/
          </div>
        </section>

        {/* Endpoint 1: List Kaggas */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                backgroundColor: 'var(--forest-green)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              GET
            </span>
            <code style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              /api/v1/kaggas.json
            </code>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            {t.api.listEndpointDesc}
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              overflowX: 'auto',
            }}
          >
            <pre style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>
{`// Sample Response: GET /api/v1/kaggas.json
{
  "page": 1,
  "pageSize": 20,
  "totalItems": 945,
  "totalPages": 48,
  "data": [
    {
      "id": 1,
      "kannadaText": "ಶ್ರೀ ವಿಷ್ಣು ವಿಶ್ವಾದಿ ಮೂಲ ಮಾಯಾಲೋಲ ।\\n...",
      "transliteration": "Sri Vishnu vishvadi mula mayalola...",
      "englishTranslation": "",
      "meaningInEnglish": "Salute to that strangeness...",
      "meaningInKannada": "ವಿಶ್ವಕ್ಕೆ ಮೂಲವಾದ ಶ್ರೀ ವಿಷ್ಣು...",
      "themes": ["Devotion", "Life", "Society"]
    }
    // ... 19 more items
  ]
}`}
            </pre>
          </div>
        </section>

        {/* Endpoint 2: Single Kagga */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                backgroundColor: 'var(--forest-green)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              GET
            </span>
            <code style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              /api/v1/kaggas/{'{id}'}.json
            </code>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            {t.api.singleEndpointDesc} (Valid range: <code>1</code> to <code>945</code>).
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              overflowX: 'auto',
            }}
          >
            <pre style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>
{`// Sample Response: GET /api/v1/kaggas/789.json
{
  "id": 789,
  "kannadaText": "ಹುಲ್ಲಾಗು ಬೆಟ್ಟದಡಿಯಲಿ, ಮನೆಗೆ ಮಲ್ಲಿಗೆಯಾಗು ।\\n...",
  "transliteration": "Hullagu bettadadiyali, manege malligeyagu...",
  "englishTranslation": "",
  "meaningInEnglish": "Be a blade of grass at the foot of the hill...",
  "meaningInKannada": "ಬೆಟ್ಟದ ಬುಡದಲ್ಲಿ ಬೆಳೆಯುವ ಹುಲ್ಲಾಗು...",
  "themes": ["Life", "Duty", "Humility"]
}`}
            </pre>
          </div>
        </section>

        {/* Random Helper Documentation */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Terminal size={18} color="var(--forest-green)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.api.randomHelperTitle}
            </h3>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
            {t.api.randomHelperDesc}
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              overflowX: 'auto',
            }}
          >
            <pre style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>
{`// JavaScript / TypeScript Client-Side Random Helper
async function fetchRandomKagga() {
  const randomId = Math.floor(Math.random() * 945) + 1;
  const response = await fetch(\`/api/v1/kaggas/\${randomId}.json\`);
  if (!response.ok) throw new Error('Failed to fetch Kagga');
  return await response.json();
}`}
            </pre>
          </div>
        </section>

        {/* Complete Dataset Export */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                backgroundColor: 'var(--forest-green)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              GET
            </span>
            <code style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              /api/v1/kaggas-all.json
            </code>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            {language === 'kn'
              ? 'ಎಲ್ಲ ೯೪೫ ಕಗ್ಗಗಳನ್ನು ಒಳಗೊಂಡ ಸಂಪೂರ್ಣ ಏಕೈಕ JSON ಕಡತ. ಆಫ್‌ಲೈನ್ ಸಂಶೋಧನೆ ಮತ್ತು ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಲಭ್ಯ.'
              : 'Complete single JSON file containing all 945 verified verses. Ideal for offline study, research, and analysis.'}
          </p>
        </section>
      </div>
    </div>
  );
};
