import styled from 'styled-components';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './types';

const StyledBadge = styled.div<StyledBadgeProps>((props) => ({
  ...getStyledBadgeStyles(props),
  width: 'fit-content',
}));

export { StyledBadge };
