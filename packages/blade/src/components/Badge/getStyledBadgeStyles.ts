import type { CSSObject } from 'styled-components';
import type { StyledBadgeProps } from './StyledBadge.d';

const getStyledBadgeStyles = ({
  backgroundColor,
  minHeight,
  borderColor,
  borderRadius,
  borderWidth,
}: StyledBadgeProps): CSSObject => ({
  backgroundColor,
  minHeight,
  borderColor,
  borderRadius,
  borderWidth,
  display: 'flex',
  maxWidth: '100px',
  flexWrap: 'nowrap',
});

export { getStyledBadgeStyles };
