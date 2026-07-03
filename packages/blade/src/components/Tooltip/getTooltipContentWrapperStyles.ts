import type React from 'react';
import type { CSSObject } from 'styled-components';
import { makeBorderSize, castWebType, isReactNative } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme/theme';
import type { Theme } from '~components/BladeProvider';

const getTooltipContentWrapperStyles = ({
  theme,
  styles,
  colorScheme,
}: {
  theme: Theme;
  styles: React.CSSProperties;
  colorScheme: ColorSchemeNames;
}): CSSObject => {
  const isDarkMode = colorScheme === 'dark';

  return {
    backgroundColor: theme.colors.popup.background.gray.intense,
    borderRadius: makeBorderSize(theme.border.radius.medium),
    ...(isDarkMode && {
      borderWidth: makeBorderSize(theme.border.width.thin),
      borderColor: theme.colors.popup.border.gray.intense,
      borderStyle: 'solid',
    }),
    boxShadow: isReactNative() ? undefined : castWebType(theme.elevation.lowRaised),
    backdropFilter: isReactNative() ? undefined : `blur(${theme.backdropBlur.high}px)`,
    ...styles,
  };
};

export { getTooltipContentWrapperStyles };
