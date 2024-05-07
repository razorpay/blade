import type { CSSObject } from 'styled-components';
import type { AnimatedChipProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { makeBorderSize } from '~utils/makeBorderSize';

const getAnimatedChipStyles = ({ theme, isDesktop, borderColor }: AnimatedChipProps): CSSObject => {
  return {
    backgroundColor: 'transparent',
    borderRadius: makeBorderSize(theme.border.radius.max),
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
