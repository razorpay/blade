import type React from 'react';
import type { CSSObject } from 'styled-components';
import { isReactNative, makeSpace, makeBorderSize, getPopupBoxShadowString } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';
import type { Theme } from '~components/BladeProvider';

const getPopoverContentWrapperStyles = ({
  theme,
  styles,
  isMobile,
  colorScheme,
}: {
  isMobile: boolean;
  theme: Theme;
  styles: React.CSSProperties;
  colorScheme: ColorSchemeNames;
}): CSSObject => {
  return {
    border: 'none',
    width: '100%',
    maxWidth: makeSpace(isMobile ? 288 : 328),
    position: isReactNative() ? 'absolute' : 'relative',
    boxShadow: isReactNative() ? undefined : getPopupBoxShadowString(theme, colorScheme),
    boxSizing: 'border-box',
    backgroundColor: theme.colors.popup.background.gray.moderate,
    borderRadius: makeBorderSize(theme.border.radius.large),
    backdropFilter: isReactNative() ? undefined : `blur(${theme.backdropBlur.high}px)`,
    ...styles,
  };
};

export { getPopoverContentWrapperStyles };
