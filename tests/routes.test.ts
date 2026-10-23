import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const distDir = path.resolve(__dirname, '../dist');

describe('Static Build Artifacts & Route Validation', () => {
  beforeAll(() => {
    // If static build artifacts are missing, build them automatically
    if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'api/v1/kaggas.json'))) {
      execSync('npm run build', {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'pipe',
        env: {
          ...process.env,
          VITE_BASE_PATH: process.env.VITE_BASE_PATH || '/mankutimmana-kagga/',
          SITE_URL: process.env.SITE_URL || 'https://thegandabherunda.github.io/mankutimmana-kagga',
        },
      });
    }
  });

  it('has generated the static JSON API files', () => {
    expect(fs.existsSync(path.join(distDir, 'api/v1/kaggas.json'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'api/v1/kaggas-all.json'))).toBe(true);

    // Verify first and last individual JSON files
    expect(fs.existsSync(path.join(distDir, 'api/v1/kaggas/1.json'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'api/v1/kaggas/945.json'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'api/v1/kaggas/789.json'))).toBe(true);

    // Verify JSON content structure
    const raw789 = fs.readFileSync(path.join(distDir, 'api/v1/kaggas/789.json'), 'utf8');
    const kagga789 = JSON.parse(raw789);
    expect(kagga789.id).toBe(789);
    expect(kagga789.kannadaText).toContain('ಹುಲ್ಲಾಗು');
    expect(kagga789.meaningInEnglish).toContain('blade of grass');
  });

  it('has generated static crawlable HTML pages for every Kagga', () => {
    // Spot check important verses
    expect(fs.existsSync(path.join(distDir, 'kagga/1/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'kagga/789/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'kagga/945/index.html'))).toBe(true);

    // Spot check aliases
    expect(fs.existsSync(path.join(distDir, 'kaggas/789/index.html'))).toBe(true);

    // Verify pre-rendered content exists in HTML
    const html789 = fs.readFileSync(path.join(distDir, 'kagga/789/index.html'), 'utf8');
    expect(html789).toContain('ಹುಲ್ಲಾಗು ಬೆಟ್ಟದಡಿ');
    expect(html789).toContain('blade of grass');
    expect(html789).toContain('ಕಗ್ಗ #789');
    expect(html789).toContain('rel="canonical"');
  });

  it('has generated all core routes and 404 fallback', () => {
    expect(fs.existsSync(path.join(distDir, 'explore/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'bookmarks/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'about/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'api-docs/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, '404.html'))).toBe(true);
  });

  it('has generated a valid sitemap.xml with 945 Kagga URLs', () => {
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
    expect(sitemapXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemapXml).toContain('<urlset');
    expect(sitemapXml).toContain('/kagga/1</loc>');
    expect(sitemapXml).toContain('/kagga/789</loc>');
    expect(sitemapXml).toContain('/kagga/945</loc>');
    expect(sitemapXml).toContain('/explore</loc>');
  });

  it('has generated robots.txt referencing the sitemap', () => {
    const robotsPath = path.join(distDir, 'robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);

    const robotsTxt = fs.readFileSync(robotsPath, 'utf8');
    expect(robotsTxt).toContain('User-agent: *');
    expect(robotsTxt).toContain('Allow: /');
    expect(robotsTxt).toContain('Sitemap:');
  });

  it('has generated social SVG preview cards', () => {
    expect(fs.existsSync(path.join(distDir, 'assets/social/kagga-1.svg'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'assets/social/kagga-789.svg'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'assets/social/kagga-945.svg'))).toBe(true);

    const svg789 = fs.readFileSync(path.join(distDir, 'assets/social/kagga-789.svg'), 'utf8');
    expect(svg789).toContain('ಹುಲ್ಲಾಗು');
    expect(svg789).toContain('ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ #789');
  });
});
