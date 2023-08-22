import type { CSSObject } from 'styled-components';
import getIn from 'lodash/get';
import type { AnimatedChipProps } from './types';
import { chipHeightTokens, chipBorderWidthTokens, chipHorizontalPaddingTokens } from './chipTokens';
import { makeBorderSize } from '~utils/makeBorderSize';

const getAnimatedChipStyles = ({
  theme,
  backgroundColor,
  borderColor,
  size,
  isChecked,
  withIcon,
  isDesktop,
}: AnimatedChipProps): CSSObject => {
  return {
    backgroundColor: getIn(theme.colors, backgroundColor),
    borderRadius: makeBorderSize(theme.border.radius.max),
    borderWidth: getIn(theme, 'border.width.thin'),
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    maxWidth: isDesktop ? '420px' : '280px',
  };
};

export { getAnimatedChipStyles };
