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
  const outerRadius = makeBorderSize(theme.border.radius[borderRadius]);
  const outerBorderWidth = getIn(theme, 'border.width.thin');

  return {
    backgroundColor: 'transparent',
    borderRadius: outerRadius,
    borderColor: getIn(theme.colors, borderColor),
    borderWidth: outerBorderWidth,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    maxWidth: isDesktop ? '420px' : '280px',
    // CSS variables for Concentric Corner rule
    '--chip-outer-radius': outerRadius,
    '--chip-outer-border-width': outerBorderWidth,
  } as CSSObject;
};

export { getAnimatedChipStyles };
