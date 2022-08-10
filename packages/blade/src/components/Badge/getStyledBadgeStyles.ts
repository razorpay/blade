import type { CSSObject } from 'styled-components';
import type { StyledBadgeProps } from './StyledBadge.d';
import { makeSize } from '~utils';

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
  maxWidth: makeSize(100),
  flexWrap: 'nowrap',
});

export { getStyledBadgeStyles };
