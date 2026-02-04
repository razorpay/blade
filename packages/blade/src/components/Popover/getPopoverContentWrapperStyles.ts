/* eslint-disable react-hooks/rules-of-hooks */
import type React from 'react';
import type { CSSObject } from 'styled-components';
import { makeBorderSize, isReactNative, makeSpace } from '~utils';
import type { Theme } from '~components/BladeProvider';
import { getPopoverBoxShadow } from './popoverTokens';

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
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.large),
    borderColor: theme.colors.popup.border.gray.moderate,
    borderStyle: 'solid',
    boxShadow: isReactNative() ? undefined : getPopoverBoxShadow(theme),
    backdropFilter: isReactNative() ? undefined : `blur(${theme.backdropBlur.high}px)`,
    ...styles,
  };
};

export { getPopoverContentWrapperStyles };
