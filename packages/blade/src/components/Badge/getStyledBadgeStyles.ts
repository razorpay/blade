import type { CSSObject } from 'styled-components';
import type { StyledBadgeProps } from './StyledBadge.d';
import { maxWidth, minHeight } from './badgeTokens';
import { getIn, makeBorderSize, makeSize } from '~utils';

const getStyledBadgeStyles = ({
  theme,
  size,
  platform,
  backgroundColor,
  borderColor,
}: StyledBadgeProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  minHeight: makeSize(minHeight[size]),
  borderColor: getIn(theme.colors, borderColor),
  borderWidth: makeBorderSize(theme.border.width.thin),
  borderRadius: makeBorderSize(theme.border.radius.max),
  maxWidth: makeSize(maxWidth[platform]),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledBadgeStyles };
