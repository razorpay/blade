import type { CSSObject } from 'styled-components';
import type { StyledBadgeProps } from './StyledBadge.d';
import { maxWidth, minHeight } from './badgeTokens';
import { makeBorderSize, makeSize } from '~utils';

const getStyledBadgeStyles = ({
  theme,
  variant,
  contrast,
  size,
  platform,
}: StyledBadgeProps): CSSObject => ({
  backgroundColor: theme.colors.feedback.background[variant][`${contrast}Contrast`],
  minHeight: makeSize(minHeight[size]),
  borderColor: theme.colors.feedback.border[variant][`${contrast}Contrast`],
  borderWidth: makeBorderSize(theme.border.width.thin),
  borderRadius: makeBorderSize(theme.border.radius.max),
  maxWidth: makeSize(maxWidth[platform]),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledBadgeStyles };
