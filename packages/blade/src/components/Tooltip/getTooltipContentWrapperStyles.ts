import type React from 'react';
import type { CSSObject } from 'styled-components';
import { makeBorderSize, castWebType, isReactNative } from '~utils';
import type { Theme } from '~components/BladeProvider';

const getTooltipContentWrapperStyles = ({
  theme,
  styles,
}: {
  theme: Theme;
  styles: React.CSSProperties;
}): CSSObject => {
  return {
    backgroundColor: theme.colors.popup.background.gray.intense,
    borderWidth: makeBorderSize(theme.border.width.thinner),
    borderRadius: makeBorderSize(theme.border.radius.medium),
    borderColor: theme.colors.popup.border.gray.intense,
    borderStyle: 'solid',
    boxShadow: isReactNative() ? undefined : castWebType(theme.elevation.lowRaised),
    backdropFilter: isReactNative() ? undefined : `blur(${theme.backdropBlur.high}px)`,
    ...styles,
  };
};

export { getTooltipContentWrapperStyles };
