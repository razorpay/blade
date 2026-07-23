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
});
