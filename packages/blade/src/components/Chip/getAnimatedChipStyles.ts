import type { CSSObject } from 'styled-components';
import getIn from 'lodash/get';
import type { AnimatedChipProps } from './types';
import { makeBorderSize } from '~utils/makeBorderSize';

const getAnimatedChipStyles = ({
  theme,
  isDesktop,
  isDisabled,
  borderColor,
}: AnimatedChipProps): CSSObject => {
  return {
    backgroundColor: isDisabled
      ? 'transparent'
      : getIn(theme.colors, 'surface.background.level2.lowContrast'),
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
