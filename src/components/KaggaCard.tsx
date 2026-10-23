import React, { useState } from 'react';
import { Kagga } from '../types/kagga';
import { useRouter } from '../router';
import { useI18n } from '../i18n/context';
import { useBookmarks } from '../bookmarks/context';
import { Bookmark, BookmarkCheck, Share2, Copy, Check, ArrowRight } from 'lucide-react';
import { convertKannadaNumerals } from '../search/unicode';

interface KaggaCardProps {
  kagga: Kagga;
  showMeaning?: boolean;
}

// Convert number to Kannada numeral string for display
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

export const KaggaCard: React.FC<KaggaCardProps> = ({ kagga, showMeaning = true }) => {
  const { navigate } = useRouter();
  const { t, language } = useI18n();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [copied, setCopied] = useState(false);

  const bookmarked = isBookmarked(kagga.id);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        `${kagga.kannadaText}\n\n${kagga.transliteration}\n\n${kagga.meaningInEnglish}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write fallback
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(kagga.id);
  };

  const handleCardClick = () => {
    navigate({ name: 'reader', id: kagga.id });
  };

  const handleThemeClick = (e: React.MouseEvent, theme: string) => {
    e.stopPropagation();
    navigate({ name: 'explore', theme });
  };

  const verseLabel =
    language === 'kn'
      ? `ಕಗ್ಗ ${toKannadaDigits(kagga.id)}`
      : `Kagga #${kagga.id}`;

  return (
    <article
      className="card kagga-card-contain"
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
      aria-labelledby={`kagga-heading-${kagga.id}`}
    >
      {/* Header: Verse number badge & quick action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="badge badge-gold" id={`kagga-heading-${kagga.id}`} style={{ fontSize: '0.88rem' }}>
          {verseLabel}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={handleCopy}
            className="btn-icon"
            style={{ width: 36, height: 36 }}
            title={copied ? t.reader.copied : t.reader.copyVerse}
            aria-label={copied ? t.reader.copied : t.reader.copyVerse}
          >
            {copied ? <Check size={16} color="var(--forest-green)" /> : <Copy size={16} />}
          </button>

          <button
            onClick={handleBookmark}
            className="btn-icon"
            style={{
              width: 36,
              height: 36,
              color: bookmarked ? 'var(--accent-gold)' : 'var(--text-secondary)',
            }}
            title={bookmarked ? t.reader.bookmarked : t.reader.bookmark}
            aria-label={bookmarked ? t.reader.bookmarked : t.reader.bookmark}
          >
            {bookmarked ? (
              <BookmarkCheck size={17} fill="var(--accent-gold)" />
            ) : (
              <Bookmark size={17} />
            )}
          </button>
        </div>
      </div>

      {/* Original Kannada Verse */}
      <div className="kannada-verse" lang="kn">
        {kagga.kannadaText}
      </div>

      {/* English Transliteration */}
      <div className="translit-text" lang="en">
        {kagga.transliteration}
      </div>

      {/* English Meaning / Explanation Excerpt */}
      {showMeaning && kagga.meaningInEnglish && (
        <div
          style={{
            fontSize: '0.94rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            borderLeft: '3px solid var(--sand)',
            paddingLeft: 12,
            marginTop: 4,
          }}
        >
          {kagga.meaningInEnglish}
        </div>
      )}

      {/* Themes and Read Full Verse Link */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginTop: 'auto',
          paddingTop: 8,
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {/* Theme Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {kagga.themes.map((theme) => (
            <button
              key={theme}
              onClick={(e) => handleThemeClick(e, theme)}
              className="badge"
              style={{
                fontSize: '0.75rem',
                cursor: 'pointer',
                background: 'var(--forest-green-subtle)',
              }}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Read more button */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--forest-green)',
          }}
        >
          <span>{t.home.readMore}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
};
