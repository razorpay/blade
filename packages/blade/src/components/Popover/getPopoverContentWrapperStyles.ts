/* eslint-disable react-hooks/rules-of-hooks */
import type React from 'react';
import type { CSSObject } from 'styled-components';
import { POPOVER_BG_DARK, POPOVER_BG_LIGHT } from './constants';
import type { Theme } from '~components/BladeProvider';
import { makeBorderSize, castWebType, isReactNative, makeSpace } from '~utils';

const getPopoverContentWrapperStyles = ({
  theme,
  styles,
  isMobile,
  colorScheme,
}: {
  isMobile: boolean;
  theme: Theme;
  styles: React.CSSProperties;
  colorScheme: 'light' | 'dark';
}): CSSObject => {
  return {
    width: '100%',
    maxWidth: makeSpace(isMobile ? 288 : 328),
    position: isReactNative() ? 'absolute' : 'relative',
    backgroundColor: colorScheme === 'dark' ? POPOVER_BG_DARK : POPOVER_BG_LIGHT,
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.large),
    borderColor: theme.colors.brand.gray[400].lowContrast,
    borderStyle: 'solid',
    boxShadow: isReactNative() ? undefined : castWebType(theme.elevation.midRaised),
    ...styles,
  };
};

export { getPopoverContentWrapperStyles };
