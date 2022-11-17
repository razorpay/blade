import type { CSSObject } from 'styled-components';
import { maxWidth } from './counterTokens';
import type { StyledCounterProps } from './types';
import { getIn, makeBorderSize, makeSize } from '~utils';

const getStyledCounterStyles = ({
  theme,
  platform,
  backgroundColor,
}: StyledCounterProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  borderRadius: makeBorderSize(theme.border.radius.max),
  maxWidth: makeSize(maxWidth[platform]),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledCounterStyles };
