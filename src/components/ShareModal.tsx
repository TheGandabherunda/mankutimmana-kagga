import React, { useState } from 'react';
import { Kagga } from '../types/kagga';
import { useI18n } from '../i18n/context';
import { Share2, Copy, Check, X, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  kagga: Kagga;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ kagga, isOpen, onClose }) => {
  const { t, language } = useI18n();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareText = `${kagga.kannadaText}\n\n${kagga.meaningInEnglish}\n\n— ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ #${kagga.id}\n${currentUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Ignore write errors
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // Ignore write errors
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ #${kagga.id}`,
          text: `${kagga.kannadaText}\n\n${kagga.meaningInEnglish}`,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(23, 28, 25, 0.75)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 520,
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 id="share-modal-title" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t.share.title} #{kagga.id}
          </h3>
          <button onClick={onClose} className="btn-icon" style={{ width: 34, height: 34 }} aria-label={t.common.close}>
            <X size={18} />
          </button>
        </div>

        {/* Preview Card */}
        <div
          style={{
            padding: 18,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          <div className="badge badge-gold" style={{ marginBottom: 10 }}>
            {language === 'kn' ? `ಕಗ್ಗ #${kagga.id}` : `Kagga #${kagga.id}`}
          </div>
          <div className="kannada-verse" style={{ fontSize: '1.1rem', marginBottom: 10 }}>
            {kagga.kannadaText}
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            {kagga.meaningInEnglish}
          </div>
        </div>

        {/* Share Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button onClick={handleNativeShare} className="btn btn-primary" style={{ width: '100%' }}>
              <Share2 size={18} aria-hidden="true" />
              <span>{t.share.nativeShare}</span>
            </button>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={handleCopyLink} className="btn btn-secondary" style={{ width: '100%' }}>
              {copiedLink ? <Check size={18} color="var(--forest-green)" /> : <Copy size={18} />}
              <span>{copiedLink ? t.share.linkCopied : t.share.copyLink}</span>
            </button>

            <button onClick={handleCopyText} className="btn btn-secondary" style={{ width: '100%' }}>
              {copiedText ? <Check size={18} color="var(--forest-green)" /> : <Copy size={18} />}
              <span>{copiedText ? t.reader.copied : t.reader.copyAll}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
