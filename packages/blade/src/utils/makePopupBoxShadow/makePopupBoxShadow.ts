/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ColorSchemeNames } from '~tokens/theme';
import type { Theme } from '~components/BladeProvider';
import type { SurfaceBoxShadow } from '~utils/makeSurfaceStyles';

const getPopupShadows = (theme: Theme, colorScheme: ColorSchemeNames): SurfaceBoxShadow => {
  const boxShadow = {
    light: {
      elevation: `${theme.elevation.midRaised}`,
      border: `inset 0px 0px 0px 1px ${theme.colors.popup.border.gray.subtle}`,
      top: `inset 0px 1px 0px 0px ${theme.colors.popup.border.gray.moderate}`,
    },
    dark: {
      elevation: `${theme.elevation.midRaised}`,
      border: `inset 0px 0px 0px 1px ${theme.colors.popup.border.gray.subtle}`,
      top: `inset 0px 1px 0px 0px ${theme.colors.popup.border.gray.moderate}`,
    },
  };
  return boxShadow[colorScheme];
};

/**
 * Returns a single CSS box-shadow string combining border, elevation, and top inner shadow.
 * Use when applying the full surface shadow to an element.
 */
export const getPopupBoxShadowString = (theme: Theme, colorScheme: ColorSchemeNames): string => {
  const { border, elevation, top } = getPopupShadows(theme, colorScheme);
  return `${border}, ${elevation}, ${top}`;
};
