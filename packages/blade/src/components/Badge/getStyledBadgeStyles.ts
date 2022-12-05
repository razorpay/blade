import type { CSSObject } from 'styled-components';
import type { StyledBadgeProps } from './types';
import { maxWidth } from './badgeTokens';
import { getIn, makeBorderSize, makeSize } from '~utils';

const getStyledBadgeStyles = ({
  theme,
  platform,
  backgroundColor,
}: StyledBadgeProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  borderRadius: makeBorderSize(theme.border.radius.max),
  maxWidth: makeSize(maxWidth[platform]),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledBadgeStyles };
