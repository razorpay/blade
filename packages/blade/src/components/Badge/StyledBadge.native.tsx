import styled from 'styled-components/native';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import type { StyledComponent } from 'styled-components';

const StyledBadge: StyledComponent<typeof BaseBox, any, StyledBadgeProps> = styled(
  BaseBox,
)<StyledBadgeProps>((props) => ({
  ...getStyledBadgeStyles(props),
  alignSelf: 'center',
}));

export { StyledBadge };
