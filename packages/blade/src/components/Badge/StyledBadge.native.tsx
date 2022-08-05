import styled from 'styled-components/native';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './StyledBadge.d';

const StyledBadge = styled.View<StyledBadgeProps>(
  ({ backgroundColor, minHeight, borderColor, borderRadius, borderWidth }) => ({
    ...getStyledBadgeStyles({ backgroundColor, minHeight, borderColor, borderRadius, borderWidth }),
    alignSelf: 'center',
  }),
);

export { StyledBadge };
