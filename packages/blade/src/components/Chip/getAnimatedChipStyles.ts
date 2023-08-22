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
    borderColor: getIn(theme.colors, borderColor),
    borderRadius: makeBorderSize(theme.border.radius.max),
    borderWidth:
      isChecked && ['medium', 'large'].includes(size)
        ? makeBorderSize(chipBorderWidthTokens.checked[size] as number)
        : getIn(theme, chipBorderWidthTokens[isChecked ? 'checked' : 'unchecked'][size]),
    height: chipHeightTokens[size],
    paddingLeft: getIn(
      theme,
      chipHorizontalPaddingTokens[withIcon ? 'icon' : 'default'].left[size],
    ),
    paddingRight: getIn(
      theme,
      chipHorizontalPaddingTokens[withIcon ? 'icon' : 'default'].right[size],
    ),
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
