import React, { useState } from 'react';
import { useRouter } from '../router';
import { useI18n } from '../i18n/context';
import { useBookmarks } from '../bookmarks/context';
import { getKaggaById, getPrevKagga, getNextKagga, MIN_KAGGA_ID, MAX_KAGGA_ID } from '../data/kaggas';
import { ShareModal } from '../components/ShareModal';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  BookOpen,
  Info,
} from 'lucide-react';

interface ReaderViewProps {
  id: number;
}

// Convert numbers to Kannada numerals
const KANNADA_DIGIT_MAP: Record<string, string> = {
  '0': '೦',
  '1': '೧',
  '2': '೨',
  '3': '೩',
  '4': '೪',
  '5': '೫',
  '6': '೬',
  '7': '೭',
  '8': '೮',
  '9': '೯',
};

function toKannadaDigits(num: number): string {
  return num.toString().replace(/[0-9]/g, (d) => KANNADA_DIGIT_MAP[d] || d);
}

export const ReaderView: React.FC<ReaderViewProps> = ({ id }) => {
  const { navigate } = useRouter();
  const { t, language } = useI18n();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const kagga = getKaggaById(id);

  if (!kagga) {
    return (
      <div className="container-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 16 }}>{t.common.notFound}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          {language === 'kn'
            ? `ಕಗ್ಗ #${id} ಲಭ್ಯವಿಲ್ಲ. ಕಗ್ಗ ಸಂಖ್ಯೆ ೧ ರಿಂದ ೯೪೫ ರ ನಡುವೆ ಇರಬೇಕು.`
            : `Kagga #${id} does not exist. Valid IDs are 1 to 945.`}
        </p>
        <button onClick={() => navigate({ name: 'explore' })} className="btn btn-primary">
          {t.reader.backToExplore}
        </button>
      </div>
    );
  }

  const prevKagga = getPrevKagga(kagga.id);
  const nextKagga = getNextKagga(kagga.id);
  const bookmarked = isBookmarked(kagga.id);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Ignore write errors
    }
  };

  const handleCopyAll = () => {
    const formatted = [
      `ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ #${kagga.id}`,
      `----------------------------------------`,
      `[ಮೂಲ ಕಗ್ಗ / Original Verse]:`,
      kagga.kannadaText,
      ``,
      `[ಆಂಗ್ಲ ಲಿಪ್ಯಂತರ / Transliteration]:`,
      kagga.transliteration,
      ``,
      `[ಆಂಗ್ಲ ವಿವರಣೆ / English Meaning]:`,
      kagga.meaningInEnglish,
      kagga.meaningInKannada ? `\n[ಕನ್ನಡ ವಿವರಣೆ / Kannada Meaning]:\n${kagga.meaningInKannada}` : '',
      kagga.themes.length > 0 ? `\n[ವಿಷಯಗಳು / Themes]: ${kagga.themes.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    copyToClipboard(formatted, 'all');
  };

  const verseLabel =
    language === 'kn'
      ? `ಕಗ್ಗ ${toKannadaDigits(kagga.id)}`
      : `Kagga #${kagga.id}`;

  return (
    <div className="container-narrow" style={{ padding: '32px 20px 80px' }}>
      {/* Top Navigation Bar: Back to Explore & Prev/Next */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => navigate({ name: 'explore' })}
          className="btn btn-ghost"
          style={{ gap: 6, paddingLeft: 0, color: 'var(--forest-green)', fontWeight: 600 }}
        >
          <ArrowLeft size={16} />
          <span>{t.reader.backToExplore}</span>
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => prevKagga && navigate({ name: 'reader', id: prevKagga.id })}
            disabled={!prevKagga}
            className="btn btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.85rem',
              opacity: prevKagga ? 1 : 0.4,
              cursor: prevKagga ? 'pointer' : 'not-allowed',
            }}
            title={prevKagga ? `${t.reader.prevVerse} (${prevKagga.id})` : undefined}
            aria-label={t.reader.prevVerse}
          >
            <ChevronLeft size={16} />
            <span className="nav-btn-text">{t.reader.prevVerse}</span>
          </button>

          <button
            onClick={() => nextKagga && navigate({ name: 'reader', id: nextKagga.id })}
            disabled={!nextKagga}
            className="btn btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.85rem',
              opacity: nextKagga ? 1 : 0.4,
              cursor: nextKagga ? 'pointer' : 'not-allowed',
            }}
            title={nextKagga ? `${t.reader.nextVerse} (${nextKagga.id})` : undefined}
            aria-label={t.reader.nextVerse}
          >
            <span className="nav-btn-text">{t.reader.nextVerse}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Literary Reading Monument */}
      <article
        className="card"
        style={{
          padding: 'clamp(24px, 5vw, 44px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          boxShadow: 'var(--shadow-md)',
        }}
        aria-labelledby="reader-verse-heading"
      >
        {/* Header: Verse number & Primary Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
          <div className="badge badge-gold" id="reader-verse-heading" style={{ fontSize: '1rem', padding: '6px 14px' }}>
            {verseLabel}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => toggleBookmark(kagga.id)}
              className="btn btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '0.85rem',
                color: bookmarked ? 'var(--accent-gold)' : 'var(--text-primary)',
              }}
              aria-label={bookmarked ? t.reader.bookmarked : t.reader.bookmark}
            >
              {bookmarked ? <BookmarkCheck size={16} fill="var(--accent-gold)" /> : <Bookmark size={16} />}
              <span>{bookmarked ? t.reader.bookmarked : t.reader.bookmark}</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              aria-label={t.reader.share}
            >
              <Share2 size={16} />
              <span>{t.reader.share}</span>
            </button>
          </div>
        </div>

        {/* 1. Original Kannada Verse (Centerpiece) */}
        <div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{t.reader.originalVerse}</span>
            <button
              onClick={() => copyToClipboard(kagga.kannadaText, 'verse')}
              className="btn-ghost"
              style={{ padding: '2px 6px', fontSize: '0.78rem', color: 'var(--forest-green)' }}
            >
              {copiedKey === 'verse' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === 'verse' ? t.reader.copied : t.reader.copyVerse}</span>
            </button>
          </div>

          <div
            className="kannada-verse"
            lang="kn"
            style={{
              fontSize: 'clamp(1.35rem, 3.5vw, 1.7rem)',
              lineHeight: 1.9,
              padding: '16px 20px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {kagga.kannadaText}
          </div>
        </div>

        {/* 2. Roman Transliteration */}
        <div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{t.reader.transliteration}</span>
            <button
              onClick={() => copyToClipboard(kagga.transliteration, 'translit')}
              className="btn-ghost"
              style={{ padding: '2px 6px', fontSize: '0.78rem', color: 'var(--forest-green)' }}
            >
              {copiedKey === 'translit' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === 'translit' ? t.reader.copied : t.reader.copyTranslit}</span>
            </button>
          </div>

          <div
            className="translit-text"
            lang="en"
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              padding: '12px 18px',
              borderLeft: '3px solid var(--sand)',
            }}
          >
            {kagga.transliteration}
          </div>
        </div>

        {/* 3. English Meaning / Explanation */}
        <div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{t.reader.englishMeaning}</span>
            <button
              onClick={() => copyToClipboard(kagga.meaningInEnglish, 'meaningEn')}
              className="btn-ghost"
              style={{ padding: '2px 6px', fontSize: '0.78rem', color: 'var(--forest-green)' }}
            >
              {copiedKey === 'meaningEn' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === 'meaningEn' ? t.reader.copied : t.reader.copyMeaningEn}</span>
            </button>
          </div>

          <div
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: 'var(--text-primary)',
              padding: '14px 18px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {kagga.meaningInEnglish}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Info size={13} />
            <span>{t.reader.englishMeaningNote}</span>
          </p>
        </div>

        {/* 4. Kannada Meaning / Commentary */}
        <div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{t.reader.kannadaMeaning}</span>
            {kagga.meaningInKannada && (
              <button
                onClick={() => copyToClipboard(kagga.meaningInKannada, 'meaningKn')}
                className="btn-ghost"
                style={{ padding: '2px 6px', fontSize: '0.78rem', color: 'var(--forest-green)' }}
              >
                {copiedKey === 'meaningKn' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedKey === 'meaningKn' ? t.reader.copied : t.reader.copyMeaningKn}</span>
              </button>
            )}
          </div>

          {kagga.meaningInKannada ? (
            <div
              className="kannada-text"
              lang="kn"
              style={{
                fontSize: '1.08rem',
                lineHeight: 1.85,
                color: 'var(--text-primary)',
                padding: '14px 18px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {kagga.meaningInKannada}
            </div>
          ) : (
            <div
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
                padding: '14px 18px',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {t.reader.kannadaMeaningMissing}
            </div>
          )}
        </div>

        {/* 5. Themes & Bulk Copy Action */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 20,
          }}
        >
          {/* Themes Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginRight: 4 }}>
              {t.reader.themesLabel}:
            </span>
            {kagga.themes.length > 0 ? (
              kagga.themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => navigate({ name: 'explore', theme })}
                  className="badge"
                  style={{ cursor: 'pointer' }}
                >
                  {theme}
                </button>
              ))
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {language === 'kn' ? 'ವರ್ಗೀಕರಿಸಿಲ್ಲ' : 'None assigned'}
              </span>
            )}
          </div>

          {/* Copy All Button */}
          <button
            onClick={handleCopyAll}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
          >
            {copiedKey === 'all' ? <Check size={16} color="var(--forest-green)" /> : <Copy size={16} />}
            <span>{copiedKey === 'all' ? t.reader.copied : t.reader.copyAll}</span>
          </button>
        </div>
      </article>

      {/* Share Modal */}
      <ShareModal
        kagga={kagga}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <style>{`
        @media (max-width: 640px) {
          .nav-btn-text { display: none; }
        }
      `}</style>
    </div>
  );
};
