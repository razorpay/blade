import { describe, expect, it } from 'vitest';
import { bladeTheme } from '~tokens/theme';
import { themeToCssVariables, cssVariablesToInlineStyle } from '~utils/themeToCssVariables';

describe('themeToCssVariables', () => {
  const resolvedTheme = {
    colors: bladeTheme.colors.onLight,
    elevation: bladeTheme.elevation.onLight,
    border: bladeTheme.border,
  };

  it('maps surface color tokens to theme.css variable names', () => {
    const vars = themeToCssVariables(resolvedTheme);

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
    const vars = themeToCssVariables(resolvedTheme);

    expect(vars['--surface-text-on-sea-subtle']).toBe(
      bladeTheme.colors.onLight.surface.text.onSea.onSubtle,
    );
    expect(vars['--surface-text-on-sea-on-subtle']).toBeUndefined();
  });

  it('maps elevation and border tokens with units', () => {
    const vars = themeToCssVariables(resolvedTheme);

    expect(vars['--elevation-low-raised']).toBe(bladeTheme.elevation.onLight.lowRaised);
    expect(vars['--border-radius-medium']).toBe(`${bladeTheme.border.radius.medium}px`);
    expect(vars['--border-radius-round']).toBe(bladeTheme.border.radius.round);
    expect(vars['--border-width-thin']).toBe(`${bladeTheme.border.width.thin}px`);
  });

  it('maps resolved typography to theme.css font variables', () => {
    const vars = themeToCssVariables({
      ...resolvedTheme,
      typography: bladeTheme.typography.onDesktop,
    });

    expect(vars['--font-family-text']).toBe(bladeTheme.typography.onDesktop.fonts.family.text);
    expect(vars['--font-size-200']).toBe(`${bladeTheme.typography.onDesktop.fonts.size[200]}px`);
    expect(vars['--letter-spacing-25']).toBe(
      `${bladeTheme.typography.onDesktop.letterSpacings[25]}%`,
    );
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
