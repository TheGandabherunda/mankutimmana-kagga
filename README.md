# ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ | Mankuthimmana Kagga

> **A Beautiful, Fast, Kannada-First Digital Sanctuary for D. V. Gundappa's (DVG) Timeless Philosophical Quatrains.**

[![Vitest](https://img.shields.io/badge/tests-17%20passed-success)](tests/)
[![Search Benchmark](https://img.shields.io/badge/search_accuracy-100%25-brightgreen)](tests/search.test.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy](https://github.com/TheGandabherunda/mankutimmana-kagga/actions/workflows/deploy.yml/badge.svg)](https://github.com/TheGandabherunda/mankutimmana-kagga/actions/workflows/deploy.yml)

---

## 📖 About the Project

*Mankuthimmana Kagga*, composed in 1943 by the revered Kannada philosopher, journalist, and poet **Dr. D. V. Gundappa (DVG)** (1887–1975), is widely cherished as the *Bhagavad Gita of Kannada*. Its 945 four-line stanzas (quatrains) explore existence, human frailty, cosmic mystery, detachment, and compassionate living.

This web application is built from the ground up to provide a contemplative, nature-inspired digital reading experience that honours the source material, puts Kannada first, and remains fast, private, and accessible on every device.

---

## ✨ Key Features

- **Kannada-First Bilingual Design**: Defaults to Kannada for all first-time visitors, with a single-click toggle to English. UI language and literary content are strictly separated.
- **Nature-Inspired Palette**: Designed with warm parchment (`#F4F0E5`), deep forest green (`#21452F`), muted sage (`#E5EAE0`), and sandalwood (`#D8C9AA`), alongside an earthen dark theme (`#171C19`).
- **High-Performance Multilingual Search**:
  - Full Unicode NFC normalization for Kannada and Latin scripts.
  - Supports Kannada numerals (e.g. `ಕಗ್ಗ ೭೮೯`), exact IDs (e.g. `789`, `#42`), Kannada phrases, transliterations, and English meanings.
  - 100% Top-1 accuracy on verified golden search benchmarks with **< 2ms average query latency**.
- **Dedicated Literary Reader**:
  - Dedicated shareable URL for every verse (`/kagga/1` to `/kagga/945`).
  - Strict field hierarchy: Kannada Quatrain → Transliteration → English Meaning → Kannada Commentary → Themes.
  - Granular copy options: Copy verse, copy transliteration, copy meaning, or copy formatted complete record.
  - Previous/Next navigation and Web Share API with clipboard fallbacks.
- **Local Bookmarks & Preferences**:
  - Stored purely on the user's device (`localStorage`).
  - No accounts, no backend tracking, zero analytics, complete privacy.
- **Static JSON API (`/api/v1/`)**:
  - Pre-generated static JSON endpoints for every verse and paginated lists.
  - Serverless and free to host on GitHub Pages or Codeberg Pages.
- **SEO & Search-Engine Crawlable**:
  - 945 pre-rendered static HTML files containing the actual literary content in the initial HTML payload.
  - Complete `sitemap.xml`, `robots.txt`, Schema.org Book metadata, and per-verse social preview cards.
- **Zero Heavy Framework Bloat**:
  - Built with Vite, React, TypeScript, Semantic HTML, and Plain CSS Custom Properties.

---

## 🎨 Design System & Theme Colors

| Element | Light Theme | Dark Theme | Role |
| :--- | :--- | :--- | :--- |
| **Background** | `#F4F0E5` | `#171C19` | Warm parchment paper / earthen night |
| **Card Surface** | `#FAF8F2` | `#222923` | Grounded reading panel |
| **Primary Accent** | `#21452F` | `#C5D6BF` | Forest green / luminous sage |
| **Dividers & Borders** | `#DFD7C7` | `#39433B` | Subtle manuscript rules |
| **Gold Highlight** | `#B8860B` | `#D4AF37` | Verse numbers & sacred notes |

Theme modes supported: **System (default)**, **Light**, and **Dark** with anti-FOUC (Flash of Unstyled Content) initialization.

---

## 🛠️ Technology Stack

- **Core**: React 18, TypeScript 5, Vite 5
- **Styling**: Semantic HTML5, Plain CSS with CSS Custom Properties
- **Icons**: [Lucide React](https://lucide.dev) (ISC / Open Source)
- **Testing**: [Vitest](https://vitest.dev) (v2.1) + jsdom
- **Hosting**: GitHub Pages & Codeberg Pages (Static-first)

---

## 📊 Dataset Provenance & Data Integrity

The complete dataset of 945 Kaggas was sourced and verified from [`data/kaggas-complete-945.ts`](data/kaggas-complete-945.ts), originating from community digitizations preserved at [github.com/rakeshmbgit/kagga-website](https://github.com/rakeshmbgit/kagga-website).

### Verification Summary
- **Total Verses**: Exactly **945** records (IDs strictly sequential from `1` to `945`).
- **Kannada Text**: 100% complete (945/945).
- **Transliteration**: 100% complete (945/945).
- **English Meaning**: 100% complete (945/945) — explanatory interpretations, faithfully labeled as meaning/commentary rather than literal translations.
- **Kannada Meaning**: 943/945 complete (gracefully noted as unavailable on IDs `3` and `883`).
- **Themes**: 924/945 complete across 15 distinct philosophical themes.

### Legal Notice & Copyright
Under **Section 22 of the Indian Copyright Act, 1957**, copyright subsists in literary works for **60 years after the calendar year of an author's death**. Because Dr. D. V. Gundappa passed away in 1975, his literary works remain under copyright in India until **January 1, 2036**. 

This application operates strictly for **non-commercial educational, cultural study, and archival appreciation**. The source code is open-source under the MIT License; literary rights belong to the heritage of Dr. D.V. Gundappa.

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+ or 22+
- npm 10+

### Setup & Run
```bash
# 1. Clone the repository
git clone https://github.com/TheGandabherunda/mankutimmana-kagga.git
cd mankutimmana-kagga

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# Opens at http://localhost:3000
```

### Build & Static Generation (SSG)
```bash
# Compile Vite bundle and generate all 945 static HTML pages, JSON API, sitemap, and social cards
npm run build

# Preview the production static output locally
npm run preview
```

### Run Tests
```bash
# Run complete test suite (Data integrity, Search benchmarks, Route checks, i18n parity)
npm test

# Run TypeScript compile validation
npm run type-check
```

---

## 🔍 Search Architecture & Benchmarks

The local search engine (`src/search/`) uses a field-weighted inverted index with deterministic ranking:
1. **Dedicated ID Match** (Score: 10,000) — Supports Arabic (`789`) and Kannada numerals (`೭೮೯`, `ಕಗ್ಗ ೧`).
2. **Exact Phrase Match** (Score: 1,200) — Full phrase matching in original Kannada verses.
3. **Transliteration Phrase Match** (Score: 700).
4. **English Meaning Phrase Match** (Score: 600).
5. **Kannada Meaning Phrase Match** (Score: 550).
6. **Token-level Matching & Themes** (Score: 40–150 per token).

### Golden Test Set Results
- **Queries Evaluated**: 24 multi-script queries (IDs, phrases, transliterations, themes, edge cases).
- **Top-1 Accuracy**: **100.0%**
- **Zero-Result Accuracy**: **100.0%**
- **Average Query Latency**: **~1.05 ms**

---

## 🌐 Static JSON API Documentation

Base URL: `https://thegandabherunda.github.io/mankutimmana-kagga/api/v1/`

### 1. Paginated Verses List
```http
GET /api/v1/kaggas.json
```
Returns Page 1 with 20 verses and pagination metadata (`page`, `pageSize`, `totalItems`, `totalPages`).
Chunk pages are accessible via `/api/v1/kaggas/page-2.json` through `/api/v1/kaggas/page-48.json`.

### 2. Single Verse Resource
```http
GET /api/v1/kaggas/{id}.json
```
Example: `GET /api/v1/kaggas/789.json`
```json
{
  "id": 789,
  "kannadaText": "ಹುಲ್ಲಾಗು ಬೆಟ್ಟದಡಿ, ಮನೆಗೆ ಮಲ್ಲಿಗೆಯಾಗು ।\n...",
  "transliteration": "hullAgu beTtadaDi, manege malligeyAgu...",
  "englishTranslation": "",
  "meaningInEnglish": "Be like a blade of grass at the bottom of a mountain...",
  "meaningInKannada": "ನೀನು, ಬೆಟ್ಟದಡಿ ದನಕರುಗಳಿಗೆ ಮೇವಾಗುವಂತಹ ಹುಲ್ಲಾಗು...",
  "themes": ["Life", "Suffering", "Nature", "Society", "Self", "Peace"]
}
```

### 3. Random Verse Helper (Client-Side)
```javascript
async function getRandomKagga() {
  const randomId = Math.floor(Math.random() * 945) + 1;
  const res = await fetch(`https://thegandabherunda.github.io/mankutimmana-kagga/api/v1/kaggas/${randomId}.json`);
  return await res.json();
}
```

### 4. Complete Dataset Export
```http
GET /api/v1/kaggas-all.json
```
Single JSON file containing all 945 verses for offline analysis.

---

## 🚢 Deployment Guide

### GitHub Pages (Automated via GitHub Actions)
1. Push to the `main` branch.
2. Ensure GitHub Pages is enabled in repository settings: **Settings → Pages → Source: GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow will:
   - Run type checks and the test suite.
   - Build the static site with the repository subpath.
   - Deploy directly to GitHub Pages.

### Codeberg Pages / Custom Root Domains
For deploying to Codeberg or a custom root domain (e.g., `mankutimmana-kagga.com`):
```bash
VITE_BASE_PATH="/" SITE_URL="https://mankutimmana-kagga.com" npm run build
```
Upload or commit the contents of `dist/` to your `pages` branch.

---

## 📄 License

- **Software Code**: [MIT License](LICENSE) © 2026 Mankutimmana Kagga Contributors.
- **Literary Content**: The verses of *Mankutimmana Kagga* belong to the cultural heritage of **Dr. D. V. Gundappa (DVG)**.