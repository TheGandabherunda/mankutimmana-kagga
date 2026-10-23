import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Footer } from '../src/components/Footer';
import { I18nProvider } from '../src/i18n/context';
import { RouterProvider } from '../src/router';

describe('Footer Component', () => {
  it('renders the subtle creator attribution with link and security attributes', () => {
    const html = renderToString(
      <I18nProvider>
        <RouterProvider>
          <Footer />
        </RouterProvider>
      </I18nProvider>
    );

    // Verify creator link existence and properties
    expect(html).toContain('href="https://github.com/TheGandabherunda"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('class="footer-creator-link"');
    expect(html).toContain('TheGandabherunda');

    // Verify attribution text and heart
    expect(html).toContain('Made with');
    expect(html).toContain('♥');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="love"');
    expect(html).toContain('by');
  });
});
