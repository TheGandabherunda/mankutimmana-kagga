/**
 * Master Static Site Generation (SSG) & Static API Build Pipeline
 * Generates:
 * 1. Static JSON API (/api/v1/kaggas.json, /api/v1/kaggas/{id}.json, /api/v1/kaggas-all.json)
 * 2. Static crawlable HTML for all 945 Kaggas (/kagga/{id}/index.html)
 * 3. Static routing fallbacks (/explore, /bookmarks, /about, /api-docs, /404.html)
 * 4. XML Sitemap (/sitemap.xml) and robots.txt
 * 5. Social share preview SVG cards (/assets/social/kagga-{id}.svg)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Read the complete 945 dataset
const dataFilePath = path.resolve(rootDir, 'data/kaggas-complete-945.ts');
const dataContent = fs.readFileSync(dataFilePath, 'utf8');
const equalIdx = dataContent.indexOf('=');
const startIdx = dataContent.indexOf('[', equalIdx);
const endIdx = dataContent.indexOf('];', startIdx);
const kaggas = JSON.parse(dataContent.slice(startIdx, endIdx + 1));

console.log(`[SSG] Loaded ${kaggas.length} Kagga records for static generation.`);

const SITE_URL = process.env.SITE_URL || 'https://thegandabherunda.github.io/mankutimmana-kagga';
const BASE_PATH = process.env.VITE_BASE_PATH || '/mankutimmana-kagga/';

// Ensure dist exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// ----------------------------------------------------
// 1. Generate Static JSON API
// ----------------------------------------------------
console.log('[SSG] Generating static JSON API...');
const apiDir = path.join(distDir, 'api/v1');
const apiKaggasDir = path.join(apiDir, 'kaggas');
fs.mkdirSync(apiKaggasDir, { recursive: true });

// 1A. All Kaggas in one JSON
fs.writeFileSync(
  path.join(apiDir, 'kaggas-all.json'),
  JSON.stringify(kaggas, null, 2),
  'utf8'
);

// 1B. Paginated List (Page 1 default + chunk pages)
const PAGE_SIZE = 20;
const totalPages = Math.ceil(kaggas.length / PAGE_SIZE);

for (let p = 1; p <= totalPages; p++) {
  const pagedData = {
    page: p,
    pageSize: PAGE_SIZE,
    totalItems: kaggas.length,
    totalPages,
    data: kaggas.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE),
  };

  if (p === 1) {
    fs.writeFileSync(
      path.join(apiDir, 'kaggas.json'),
      JSON.stringify(pagedData, null, 2),
      'utf8'
    );
  }

  fs.writeFileSync(
    path.join(apiKaggasDir, `page-${p}.json`),
    JSON.stringify(pagedData, null, 2),
    'utf8'
  );
}

// 1C. Individual Kagga JSON files (1..945)
for (const kagga of kaggas) {
  fs.writeFileSync(
    path.join(apiKaggasDir, `${kagga.id}.json`),
    JSON.stringify(kagga, null, 2),
    'utf8'
  );
}
console.log(`[SSG] Generated ${kaggas.length} individual API JSON files.`);

// ----------------------------------------------------
// 2. Generate Social SVG Share Cards
// ----------------------------------------------------
console.log('[SSG] Generating social SVG share cards...');
const socialDir = path.join(distDir, 'assets/social');
fs.mkdirSync(socialDir, { recursive: true });

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

for (const kagga of kaggas) {
  const lines = kagga.kannadaText.split('\n').filter(Boolean);
  const lineSpans = lines
    .slice(0, 4)
    .map((l: string, i: number) => `<tspan x="60" dy="${i === 0 ? '0' : '44'}">${escapeXml(l)}</tspan>`)
    .join('');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F4F0E5"/>
      <stop offset="100%" stop-color="#EBE4D5"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="30" y="30" width="1140" height="570" fill="none" stroke="#21452F" stroke-width="2" rx="12"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#D8C9AA" stroke-width="1" rx="8"/>
  
  <text x="60" y="90" font-family="'Noto Serif Kannada', Georgia, serif" font-size="28" font-weight="bold" fill="#21452F">
    ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ #${kagga.id}
  </text>
  <text x="1140" y="90" font-family="-apple-system, sans-serif" font-size="20" fill="#7A867D" text-anchor="end">
    Dr. D. V. Gundappa (DVG)
  </text>
  <line x1="60" y1="120" x2="1140" y2="120" stroke="#DFD7C7" stroke-width="1"/>
  
  <text x="60" y="210" font-family="'Noto Serif Kannada', Georgia, serif" font-size="34" font-weight="600" fill="#1F2E23">
    ${lineSpans}
  </text>
  
  <rect x="60" y="520" width="140" height="36" rx="6" fill="#21452F"/>
  <text x="130" y="544" font-family="-apple-system, sans-serif" font-size="16" fill="#F4F0E5" font-weight="bold" text-anchor="middle">
    Kagga #${kagga.id}
  </text>
  <text x="1140" y="544" font-family="-apple-system, sans-serif" font-size="18" fill="#536056" text-anchor="end">
    mankutimmana-kagga.com
  </text>
</svg>`;

  fs.writeFileSync(path.join(socialDir, `kagga-${kagga.id}.svg`), svgContent, 'utf8');
}
console.log(`[SSG] Generated ${kaggas.length} social SVG cards.`);

// ----------------------------------------------------
// 3. Generate Static HTML Pages for all 945 Kaggas
// ----------------------------------------------------
console.log('[SSG] Generating static HTML pages...');
const templatePath = path.join(distDir, 'index.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

for (const kagga of kaggas) {
  const pageTitle = `ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ #${kagga.id} | Mankuthimmana Kagga #${kagga.id} - ಡಿ. ವಿ. ಗುಂಡಪ್ಪ`;
  const firstLine = kagga.kannadaText.split('\n')[0].replace(/[।॥]/g, '').trim();
  const pageDesc = `${firstLine} - ${kagga.meaningInEnglish.slice(0, 140)}...`;
  const canonicalUrl = `${SITE_URL.replace(/\/$/, '')}/kagga/${kagga.id}`;
  const socialImageUrl = `${SITE_URL.replace(/\/$/, '')}/assets/social/kagga-${kagga.id}.svg`;

  // Pre-rendered semantic literary content for non-JS and search crawlers
  const preRenderedContent = `
    <div class="container-narrow" style="padding: 40px 20px;">
      <article class="card">
        <header>
          <span class="badge badge-gold">ಕಗ್ಗ #${kagga.id}</span>
          <h1 class="kannada-text" style="font-size: 1.8rem; margin: 16px 0;">ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ #${kagga.id}</h1>
        </header>
        <section class="kannada-verse" lang="kn" style="margin: 20px 0; font-size: 1.4rem; white-space: pre-line;">
${escapeXml(kagga.kannadaText)}
        </section>
        <section class="translit-text" lang="en" style="margin: 16px 0; font-style: italic;">
${escapeXml(kagga.transliteration)}
        </section>
        <section class="meaning-text" style="margin: 20px 0; padding: 14px; background-color: var(--bg-app);">
          <h2 style="font-size: 1rem; color: var(--text-muted); margin-bottom: 6px;">ಆಂಗ್ಲ ಭಾವಾರ್ಥ / English Meaning:</h2>
          <p>${escapeXml(kagga.meaningInEnglish)}</p>
        </section>
        ${
          kagga.meaningInKannada
            ? `<section class="kannada-text" style="margin: 16px 0;">
                <h2 style="font-size: 1rem; color: var(--text-muted); margin-bottom: 6px;">ಕನ್ನಡ ತಾತ್ಪರ್ಯ:</h2>
                <p>${escapeXml(kagga.meaningInKannada)}</p>
              </section>`
            : ''
        }
        <footer>
          <p style="font-size: 0.85rem; color: var(--text-muted);">ರಚನೆ: ಡಾ. ಡಿ. ವಿ. ಗುಂಡಪ್ಪ (ಡಿವಿಜಿ) | Themes: ${kagga.themes.join(', ')}</p>
        </footer>
      </article>
    </div>
  `;

  // Inject meta tags and pre-rendered content into template
  let pageHtml = templateHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeXml(pageTitle)}</title>`)
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${escapeXml(pageDesc)}" />\n    <link rel="canonical" href="${canonicalUrl}" />\n    <meta property="og:url" content="${canonicalUrl}" />\n    <meta property="og:title" content="${escapeXml(pageTitle)}" />\n    <meta property="og:description" content="${escapeXml(pageDesc)}" />\n    <meta property="og:image" content="${socialImageUrl}" />\n    <meta name="twitter:image" content="${socialImageUrl}" />`
    )
    .replace('<div id="root"></div>', `<div id="root">${preRenderedContent}</div>`);

  // Write to /kagga/{id}/index.html
  const kaggaPageDir = path.join(distDir, `kagga/${kagga.id}`);
  fs.mkdirSync(kaggaPageDir, { recursive: true });
  fs.writeFileSync(path.join(kaggaPageDir, 'index.html'), pageHtml, 'utf8');

  // Also write to /kaggas/{id}/index.html for alias compatibility
  const kaggasAliasDir = path.join(distDir, `kaggas/${kagga.id}`);
  fs.mkdirSync(kaggasAliasDir, { recursive: true });
  fs.writeFileSync(path.join(kaggasAliasDir, 'index.html'), pageHtml, 'utf8');
}
console.log(`[SSG] Generated ${kaggas.length} static HTML verse pages.`);

// ----------------------------------------------------
// 4. Generate Static Routes for Main Views
// ----------------------------------------------------
const routes = ['explore', 'bookmarks', 'about', 'api-docs'];
for (const route of routes) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), templateHtml, 'utf8');
}

// 404.html for GitHub Pages and Codeberg
fs.writeFileSync(path.join(distDir, '404.html'), templateHtml, 'utf8');
console.log('[SSG] Generated static routes and 404.html.');

// ----------------------------------------------------
// 5. Generate XML Sitemap & robots.txt
// ----------------------------------------------------
console.log('[SSG] Generating sitemap.xml and robots.txt...');
const today = new Date().toISOString().split('T')[0];

const sitemapUrls = [
  `  <url><loc>${SITE_URL.replace(/\/$/, '')}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  `  <url><loc>${SITE_URL.replace(/\/$/, '')}/explore</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
  `  <url><loc>${SITE_URL.replace(/\/$/, '')}/bookmarks</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
  `  <url><loc>${SITE_URL.replace(/\/$/, '')}/about</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
  `  <url><loc>${SITE_URL.replace(/\/$/, '')}/api-docs</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
];

for (const kagga of kaggas) {
  sitemapUrls.push(
    `  <url><loc>${SITE_URL.replace(/\/$/, '')}/kagga/${kagga.id}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
  );
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL.replace(/\/$/, '')}/sitemap.xml
`;

fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
console.log('[SSG] Sitemap and robots.txt generated successfully.');
console.log('[SSG] Build complete!');
