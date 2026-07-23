import { describe, expect, it } from 'vitest';
import { bladeTheme } from '~tokens/theme';
import { themeToCSSVariables, cssVariablesToInlineStyle } from '~utils/themeToCSSVariables';

describe('themeToCSSVariables', () => {
  const resolvedTheme = {
    colors: bladeTheme.colors.onLight,
    elevation: bladeTheme.elevation.onLight,
    border: bladeTheme.border,
  };

  it('maps surface color tokens to theme.css variable names', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--surface-background-gray-subtle']).toBe(
      bladeTheme.colors.onLight.surface.background.gray.subtle,
    );
    expect(vars['--surface-background-primary-intense']).toBe(
      bladeTheme.colors.onLight.surface.background.primary.intense,
    );
    expect(vars['--interactive-background-primary-default']).toBe(
      bladeTheme.colors.onLight.interactive.background.primary.default,
    );
  });

  it('normalizes onSea.onSubtle to --surface-text-on-sea-subtle', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--surface-text-on-sea-subtle']).toBe(
      bladeTheme.colors.onLight.surface.text.onSea.onSubtle,
    );
    expect(vars['--surface-text-on-sea-on-subtle']).toBeUndefined();
  });

  it('maps elevation and border tokens with units', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--elevation-low-raised']).toBe(bladeTheme.elevation.onLight.lowRaised);
    expect(vars['--border-radius-medium']).toBe(`${bladeTheme.border.radius.medium}px`);
    expect(vars['--border-radius-round']).toBe(bladeTheme.border.radius.round);
    expect(vars['--border-width-thin']).toBe(`${bladeTheme.border.width.thin}px`);
  });

  it('serializes variables to an inline style string', () => {
    const style = cssVariablesToInlineStyle({
      '--border-radius-medium': '16px',
      '--surface-background-primary-intense': 'hsla(160, 50%, 40%, 1)',
    });

    expect(style).toContain('--border-radius-medium:16px');
    expect(style).toContain('--surface-background-primary-intense:hsla(160, 50%, 40%, 1)');
  });
});
