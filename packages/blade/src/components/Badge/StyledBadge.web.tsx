import styled from 'styled-components';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './StyledBadge.d';

const StyledBadge = styled.div<StyledBadgeProps>(
  ({ backgroundColor, minHeight, borderColor, borderRadius, borderWidth }) => ({
    ...getStyledBadgeStyles({ backgroundColor, minHeight, borderColor, borderRadius, borderWidth }),
    width: 'fit-content',
    borderStyle: 'solid',
  }),
);

export { StyledBadge };
