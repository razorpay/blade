/* eslint-disable react-hooks/rules-of-hooks */
import type React from 'react';
import type { CSSObject } from 'styled-components';
import { isReactNative, makeSpace, makeBorderSize } from '~utils';
import { getPopoverBoxShadow } from './popoverTokens';
import type { Theme } from '~components/BladeProvider';

const getPopoverContentWrapperStyles = ({
  theme,
  styles,
  isMobile,
}: {
  isMobile: boolean;
  theme: Theme;
  styles: React.CSSProperties;
}): CSSObject => {
  return {
    width: '100%',
    maxWidth: makeSpace(isMobile ? 288 : 328),
    position: isReactNative() ? 'absolute' : 'relative',
    backgroundColor: theme.colors.popup.background.gray.moderate,
    borderRadius: makeBorderSize(theme.border.radius.large),
    boxShadow: isReactNative() ? undefined : getPopoverBoxShadow(theme),
    backdropFilter: isReactNative() ? undefined : `blur(${theme.backdropBlur.high}px)`,
    ...styles,
  };
};

export { getPopoverContentWrapperStyles };
