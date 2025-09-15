import type { StyledComponent } from 'styled-components';
import styled from 'styled-components';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledBadge: StyledComponent<typeof BaseBox, any, StyledBadgeProps> = styled(
  BaseBox,
)<StyledBadgeProps>((props) => ({
  ...getStyledBadgeStyles(props),
  width: 'fit-content',
}));

export { StyledBadge };
