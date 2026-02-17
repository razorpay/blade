import { colors } from '~tokens/global';
import type { ColorSchemeNames } from '~tokens/theme';
import type { Theme } from '~components/BladeProvider';

export type SurfaceBoxShadow = {
  elevation: string;
  border: string;
  top: string;
};

/**
 * Returns the surface-style box shadow layers (elevation, border, top inner shadow)
 * for use in Card, Table, and other elevated surfaces. Use the same shadow in both
 * places for visual consistency.
 *
 * @param theme - Blade theme (from useTheme())
 * @param colorScheme - 'light' | 'dark'
 * @returns Object with elevation, border, and top shadow CSS strings
 */
export const getSurfaceBoxShadow = (
  theme: Theme,
  colorScheme: ColorSchemeNames,
): SurfaceBoxShadow => {
  const boxShadow = {
    light: {
      elevation: `0px 6px 32px 4px ${colors.neutral.blueGrayLight.a406}`,
      border: `inset 0px 0px 0px 1px ${theme.colors.interactive.border.gray.default}`,
      top: `inset 0px -1.5px 0px 1px ${theme.colors.surface.background.gray.intense}`,
    },
    dark: {
      elevation: `0px 6px 12px 4px ${colors.neutral.black[5]}`,
      border: `inset 0px 0px 0px 0px ${theme.colors.interactive.border.gray.default}`,
      top: `inset 0px 0px 0px 1px ${theme.colors.surface.background.gray.intense}`,
    },
  };
  return boxShadow[colorScheme];
};

/**
 * Returns a single CSS box-shadow string combining border, elevation, and top inner shadow.
 * Use when applying the full surface shadow to an element.
 */
export const getSurfaceBoxShadowString = (
  theme: Theme,
  colorScheme: ColorSchemeNames,
): string => {
  const { border, elevation, top } = getSurfaceBoxShadow(theme, colorScheme);
  return `${border}, ${elevation}, ${top}`;
};

export type SurfaceGradientColors = {
  start: string;
  end: string;
};

export type SurfaceGradients = {
  top: SurfaceGradientColors;
  bottom: SurfaceGradientColors;
};

const surfaceGradientsByScheme: Record<ColorSchemeNames, SurfaceGradients> = {
  light: {
    top: {
      start: colors.neutral.blueGrayLight[0],
      end: colors.neutral.blueGrayLight[0],
    },
    bottom: {
      start: colors.neutral.blueGrayLight[0],
      end: colors.neutral.blueGrayLight[50],
    },
  },
  dark: {
    top: {
      start: colors.neutral.blueGrayDark[1000],
      end: colors.neutral.blueGrayDark[1100],
    },
    bottom: {
      start: colors.neutral.blueGrayDark[1100],
      end: colors.neutral.blueGrayDark[1300],
    },
  },
};

/**
 * Returns the surface gradient colors (top and bottom) for Card-style overlays.
 * Used by CardSurface only; not consumed by Table.
 *
 * @param colorScheme - 'light' | 'dark'
 * @returns Object with top and bottom gradient { start, end } colors
 */
export const getSurfaceGradients = (colorScheme: ColorSchemeNames): SurfaceGradients =>
  surfaceGradientsByScheme[colorScheme];
