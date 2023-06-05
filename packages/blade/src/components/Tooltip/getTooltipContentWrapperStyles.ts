import type React from 'react';
import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeBorderSize, castWebType } from '~utils';

const getTooltipContentWrapperStyles = ({
  theme,
  styles,
}: {
  theme: Theme;
  styles: React.CSSProperties;
}): CSSObject => {
  return {
    backgroundColor: theme.colors.brand.gray[200].highContrast,
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.medium),
    borderColor: theme.colors.brand.gray[300].highContrast,
    borderStyle: 'solid',
    boxShadow: castWebType(theme.elevation.lowRaised),
    ...styles,
  };
};

export { getTooltipContentWrapperStyles };
