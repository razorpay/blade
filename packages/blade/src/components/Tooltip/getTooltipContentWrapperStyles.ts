import type React from 'react';
import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeBorderSize, castWebType, isReactNative } from '~utils';

const getTooltipContentWrapperStyles = ({
  theme,
  styles,
}: {
  theme: Theme;
  styles: React.CSSProperties;
}): CSSObject => {
  return {
    backgroundColor: theme.colors."'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN'",
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.medium),
    borderColor: theme.colors."'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN'",
    borderStyle: 'solid',
    boxShadow: isReactNative() ? undefined : castWebType(theme.elevation.lowRaised),
    ...styles,
  };
};

export { getTooltipContentWrapperStyles };
