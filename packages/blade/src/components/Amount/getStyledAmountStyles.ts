import type { CSSObject } from 'styled-components';
import type { StyledAmountProps } from './types';
import { getIn, makeBorderSize } from '~utils';

const getStyledAmountStyles = ({ theme, backgroundColor }: StyledAmountProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  borderRadius: makeBorderSize(theme.border.radius.max),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledAmountStyles };
