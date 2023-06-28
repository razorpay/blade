import getIn from 'lodash/get';
import type { CSSObject } from 'styled-components';
import { maxWidth } from './counterTokens';
import type { StyledCounterProps } from './types';
import { makeSize } from '~utils/makeSize';
import { makeBorderSize } from '~utils/makeBorderSize';

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
