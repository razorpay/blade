import type { CSSObject } from 'styled-components';
import type { StyledBadgeProps } from './types';
import { maxWidth, minHeight } from './badgeTokens';
import { getIn, makeBorderSize, makeSize } from '~utils';

const getStyledBadgeStyles = ({
  theme,
  size,
  platform,
  backgroundColor,
}: StyledBadgeProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  minHeight: makeSize(minHeight[size]),
  borderRadius: makeBorderSize(theme.border.radius.max),
  maxWidth: makeSize(maxWidth[platform]),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledBadgeStyles };
