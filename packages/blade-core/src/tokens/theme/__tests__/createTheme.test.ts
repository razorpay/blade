import { describe, expect, it } from 'vitest';
import { createTheme } from '../createTheme';
import { bladeTheme } from '../index';

describe('createTheme', () => {
  it('creates a branded theme from brandColor', () => {
    const { theme, brandColors } = createTheme({ brandColor: '#19BEA2' });

    expect(theme.name).toBe('custom-19bea2');
    expect(brandColors[600]).toBeTruthy();
    expect(theme.colors.onLight.interactive.background.primary.default).toBe(brandColors[600]);
    expect(theme.colors.onLight.surface.background.primary.intense).toBe(brandColors[600]);
  });

  it('applies optional borderRadius overrides', () => {
    const { theme } = createTheme({
      brandColor: '#19BEA2',
      borderRadius: { medium: 16, large: 20 },
    });

    expect(theme.border.radius.medium).toBe(16);
    expect(theme.border.radius.large).toBe(20);
    expect(theme.border.radius.small).toBe(bladeTheme.border.radius.small);
  });

  it('applies fontFamily and fontSizeScaleFactor on both platforms', () => {
    const { theme } = createTheme({
      brandColor: '#19BEA2',
      fontFamily: { text: 'CustomText, sans-serif', heading: 'CustomHeading, serif' },
      fontSizeScaleFactor: 1.1,
    });

    expect(theme.typography.onDesktop.fonts.family.text).toBe('CustomText, sans-serif');
    expect(theme.typography.onMobile.fonts.family.heading).toBe('CustomHeading, serif');
    expect(theme.typography.onDesktop.fonts.size[200]).toBe(
      Math.round(bladeTheme.typography.onDesktop.fonts.size[200] * 1.1),
    );
  });

  it('applies surface page background override without clobbering brand primary surface', () => {
    const { theme } = createTheme({
      brandColor: '#19BEA2',
      surface: { background: { page: '#eef2f6' } },
    });

    expect(theme.colors.onLight.surface.background.gray.moderate).toBe('#eef2f6');
    expect(theme.colors.onLight.surface.background.primary.intense).toBeTruthy();
  });

  it('returns fontFaceCss when fontFaces are provided', () => {
    const { fontFaceCss } = createTheme({
      brandColor: '#19BEA2',
      fontFaces: [
        {
          fontFamily: 'MerchantBrand',
          src: 'https://example.com/brand.woff2',
          format: 'woff2',
          fontDisplay: 'swap',
        },
      ],
    });

    expect(fontFaceCss).toContain('@font-face');
    expect(fontFaceCss).toContain('MerchantBrand');
    expect(fontFaceCss).toContain('brand.woff2');
  });
});
