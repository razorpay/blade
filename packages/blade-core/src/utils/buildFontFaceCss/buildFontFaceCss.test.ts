import { describe, expect, it } from 'vitest';
import { buildFontFaceCss } from './buildFontFaceCss';

describe('buildFontFaceCss', () => {
  it('emits @font-face with format and display', () => {
    const css = buildFontFaceCss([
      {
        fontFamily: 'Merchant Sans',
        src: '/fonts/merchant.woff2',
        format: 'woff2',
        fontWeight: 600,
        fontDisplay: 'swap',
      },
    ]);

    expect(css).toContain('@font-face');
    expect(css).toContain('"Merchant Sans"');
    expect(css).toContain('url("/fonts/merchant.woff2") format(\'woff2\')');
    expect(css).toContain('font-weight: 600');
    expect(css).toContain('font-display: swap');
  });
});
