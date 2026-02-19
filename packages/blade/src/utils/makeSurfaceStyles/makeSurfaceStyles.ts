import { colors, size } from '~tokens/global';
import type { ColorSchemeNames } from '~tokens/theme';
import type { Theme } from '~components/BladeProvider';
import { makeSpace } from '~utils/makeSpace';

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
 *
 * @param colorScheme - 'light' | 'dark'
 * @returns Object with top and bottom gradient { start, end } colors
 */
export const getSurfaceGradients = (colorScheme: ColorSchemeNames): SurfaceGradients =>
  surfaceGradientsByScheme[colorScheme];

/**
 * Returns the common surface decoration styles (box-shadow, border, gradients)
 * for use in Card, Table, ListView, and other elevated surfaces.
 * Spread this into a styled-component's return object alongside layout styles.
 */
export const getSurfaceStyles = (
  theme: Theme,
  colorScheme: ColorSchemeNames,
  options?: { beforeGradientZIndex?: number; afterGradientZIndex?: number },
): Record<string, unknown> => {
  const isDarkMode = colorScheme === 'dark';
  const boxShadow = getSurfaceBoxShadowString(theme, colorScheme);
  const { top: topGradientColor, bottom: bottomGradientColor } = getSurfaceGradients(colorScheme);
  const beforeGradientZIndex = options?.beforeGradientZIndex ?? -1;
  const afterGradientZIndex = options?.afterGradientZIndex ?? -1;

  return {
    boxShadow,
    border: 'none',
    borderTop: isDarkMode ? `1px solid ${theme.colors.surface.border.gray.subtle}` : '',
    isolation: 'isolate',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: isDarkMode ? 0 : 1,
      left: 1,
      right: 1,
      height: makeSpace(size[16]),
      background: `linear-gradient(${topGradientColor.start} 0%, ${topGradientColor.end} 100%)`,
      pointerEvents: 'none',
      borderRadius: 'inherit',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      zIndex: beforeGradientZIndex,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: isDarkMode ? 1 : 2,
      left: 1,
      right: 1,
      height: makeSpace(size[16]),
      background: `linear-gradient(${bottomGradientColor.start} 0%, ${bottomGradientColor.end} 100%)`,
      pointerEvents: 'none',
      borderRadius: 'inherit',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      zIndex: afterGradientZIndex,
    },
  };
};
