import type { CSSObject } from 'styled-components';
import { maxWidth, counterMinWidth } from './counterTokens';
import type { StyledCounterProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { makeSize } from '~utils/makeSize';
import { makeBorderSize } from '~utils/makeBorderSize';

const getStyledCounterStyles = ({
  theme,
  platform,
  backgroundColor,
  size,
}: StyledCounterProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  borderRadius: makeBorderSize(theme.border.radius.max),
  maxWidth: makeSize(maxWidth[platform]),
  minWidth: makeSize(counterMinWidth[size]),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledCounterStyles };
