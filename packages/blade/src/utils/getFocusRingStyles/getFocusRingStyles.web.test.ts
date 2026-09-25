import { bladeTheme } from '../../tokens';
import { getFocusRingStyles } from './getFocusRingStyles';

describe('getFocusRingStyles', () => {
  it('should return correct styles when called with valid parameters', () => {
    const result = getFocusRingStyles({
      theme: {
        ...bladeTheme,
        colors: bladeTheme.colors.onLight,
        elevation: bladeTheme.elevation.onLight,
        typography: bladeTheme.typography.onDesktop,
      },
    });
    expect(result).toMatchObject({
      outline: '4px solid hsla(218, 89%, 51%, 0.18)',
      outlineOffset: '1px',
      transitionDuration: '80ms',
      transitionProperty: 'outline-width',
      transitionTimingFunction: 'cubic-bezier(0.3, 0, 0.2, 1)',
    });
  });

  it('should draw the neutral ring when asked for the neutral variant', () => {
    const theme = {
      ...bladeTheme,
      colors: bladeTheme.colors.onLight,
      elevation: bladeTheme.elevation.onLight,
      typography: bladeTheme.typography.onDesktop,
    };

    // Everything but the colour should match the primary ring, so neutral components keep the
    // same focus geometry and motion as the rest of the system.
    const { outline: primaryOutline, ...primaryRest } = getFocusRingStyles({ theme });
    const { outline: neutralOutline, ...neutralRest } = getFocusRingStyles({
      theme,
      variant: 'neutral',
    });

    expect(neutralRest).toStrictEqual(primaryRest);
    expect(neutralOutline).not.toBe(primaryOutline);
    expect(neutralOutline).toBe(`4px solid ${theme.colors.interactive.border.neutral.faded}`);
  });
});
