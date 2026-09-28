import { describe, expect, it, vi, afterEach } from 'vitest';
import { bladeTheme, createTheme } from '@razorpay/blade-core/tokens';
import {
  themeToCSSVariables,
  cssVariablesToInlineStyle,
  mergeStyleOverride,
} from '@razorpay/blade-core/utils';
import { getColorScheme, isValidColorSchemeInput } from './getColorScheme';
import { getTypographyPlatform } from './getTypographyPlatform';
import { resolveBladeTheme } from './resolveBladeTheme';
import type { BladeComponentConfig } from './types';

describe('getColorScheme', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: originalDocument,
      configurable: true,
      writable: true,
    });
  });

  it('returns light and dark as-is', () => {
    expect(getColorScheme('light')).toBe('light');
    expect(getColorScheme('dark')).toBe('dark');
  });

  it('resolves system via explicit systemPrefersDark', () => {
    expect(getColorScheme('system', true)).toBe('dark');
    expect(getColorScheme('system', false)).toBe('light');
  });

  it('resolves system via prefers-color-scheme when window exists', () => {
    Object.defineProperty(globalThis, 'window', {
      value: {
        matchMedia: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('dark'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      },
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: {},
      configurable: true,
      writable: true,
    });

    expect(getColorScheme('system')).toBe('dark');
  });

  it('falls back to light for system without matchMedia', () => {
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    expect(getColorScheme('system')).toBe('light');
  });

  it('validates color scheme inputs', () => {
    expect(isValidColorSchemeInput('light')).toBe(true);
    expect(isValidColorSchemeInput('system')).toBe(true);
    expect(isValidColorSchemeInput('neon')).toBe(false);
  });
});

describe('getTypographyPlatform', () => {
  it('returns onMobile for mobile device type', () => {
    expect(getTypographyPlatform('mobile')).toBe('onMobile');
  });

  it('returns onDesktop for desktop device type', () => {
    expect(getTypographyPlatform('desktop')).toBe('onDesktop');
  });
});

describe('resolveBladeTheme', () => {
  it('flattens onDark colors for dark scheme', () => {
    const { theme, colorScheme, platform } = resolveBladeTheme({
      themeTokens: bladeTheme,
      colorSchemeInput: 'dark',
      deviceType: 'desktop',
    });

    expect(colorScheme).toBe('dark');
    expect(platform).toBe('onDesktop');
    expect(theme.colors).toEqual(bladeTheme.colors.onDark);
    expect(theme.elevation).toEqual(bladeTheme.elevation.onDark);
    expect(theme.typography).toEqual(bladeTheme.typography.onDesktop);
  });

  it('applies createTheme brand tokens into CSS variables', () => {
    const { theme: themeTokens } = createTheme({
      brandColor: '#19BEA2',
      borderRadius: { medium: 16 },
    });
    const { theme } = resolveBladeTheme({
      themeTokens,
      colorSchemeInput: 'light',
      deviceType: 'desktop',
    });

    const vars = themeToCSSVariables({
      colors: theme.colors,
      elevation: theme.elevation,
      border: theme.border,
    });

    expect(vars['--border-radius-medium']).toBe('16px');
    expect(vars['--interactive-background-primary-default']).toBe(
      theme.colors.interactive.background.primary.default,
    );
    expect(cssVariablesToInlineStyle(vars)).toContain('--border-radius-medium:16px');
  });
});

describe('componentConfig styleOverride precedence', () => {
  it('instance override wins over provider componentConfig', () => {
    const providerConfig: BladeComponentConfig = {
      styleOverride: { root: 'provider-cta', text: 'provider-label' },
    };
    const instanceOverride = { root: 'instance-cta' };

    const resolved = mergeStyleOverride(providerConfig.styleOverride, instanceOverride);

    expect(resolved).toEqual({
      root: 'instance-cta',
      text: 'provider-label',
    });
  });
});
