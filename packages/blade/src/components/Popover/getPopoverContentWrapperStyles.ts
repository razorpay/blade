import type React from 'react';
import type { CSSObject } from 'styled-components';
import { isReactNative, makeSpace, makeBorderSize, getPopupBoxShadowString } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';
import type { Theme } from '~components/BladeProvider';
import type { SpacingValueType } from '~components/Box/BaseBox/types/spacingTypes';
import { DEFAULT_MAX_WIDTH_DESKTOP, DEFAULT_MAX_WIDTH_MOBILE } from './constants';

const getPopoverContentWrapperStyles = ({
  theme,
  styles,
  isMobile,
  colorScheme,
  maxWidth,
}: {
  isMobile: boolean;
  theme: Theme;
  styles: React.CSSProperties;
  colorScheme: ColorSchemeNames;
  maxWidth?: SpacingValueType;
}): CSSObject => {
  return {
    border: 'none',
    width: '100%',
    // When maxWidth prop is provided, let BaseBox handle it (it resolves spacing tokens).
    // When not provided, use the default from getPopoverContentWrapperStyles.
    ...(maxWidth
      ? {}
      : {
          maxWidth: makeSpace(isMobile ? DEFAULT_MAX_WIDTH_MOBILE : DEFAULT_MAX_WIDTH_DESKTOP),
        }),
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
