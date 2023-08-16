import type { CSSObject } from 'styled-components';
import getIn from 'lodash/get';
import type { StyledChipProps } from './types';
import { chipHeightTokens, chipBorderWidthTokens } from './chipTokens';
import { makeBorderSize } from '~utils/makeBorderSize';

const getStyledChipStyles = ({
  theme,
  backgroundColor,
  size,
  isChecked,
}: StyledChipProps): CSSObject => {
  console.log(theme.border);
  return {
    backgroundColor: getIn(theme.colors, backgroundColor),
    borderRadius: makeBorderSize(theme.border.radius.max),
    borderWidth:
      isChecked && ['medium', 'large'].includes(size)
        ? makeBorderSize(chipBorderWidthTokens.checked[size] as number)
        : getIn(theme.border, chipBorderWidthTokens[isChecked ? 'checked' : 'unchecked'][size]),
    height: chipHeightTokens[size],
    display: 'flex',
    flexWrap: 'nowrap',
  };
};

export { getStyledChipStyles };
