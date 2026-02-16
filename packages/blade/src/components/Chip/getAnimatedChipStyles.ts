import type { CSSObject } from 'styled-components';
import getIn from '~utils/lodashButBetter/get';
import { makeBorderSize } from '~utils/makeBorderSize';
import type { AnimatedChipProps } from './types';
import { chipBorderRadiusTokens } from './chipTokens';

const getAnimatedChipStyles = ({
  theme,
  isDesktop,
  borderColor,
  size = 'small',
}: AnimatedChipProps): CSSObject => {
  const borderRadius = chipBorderRadiusTokens[size];
  return {
    backgroundColor: 'transparent',
    borderRadius: makeBorderSize(theme.border.radius[borderRadius]),
    borderColor: getIn(theme.colors, borderColor),
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
