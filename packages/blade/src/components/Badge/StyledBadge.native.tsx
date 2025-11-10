import styled from 'styled-components/native';
import type { DefaultTheme, StyledComponent } from 'styled-components';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledBadge: StyledComponent<typeof BaseBox, DefaultTheme, StyledBadgeProps> = styled(
  BaseBox,
)<StyledBadgeProps>((props) => ({
  ...getStyledBadgeStyles(props),
  alignSelf: 'center',
}));

export { StyledBadge };
