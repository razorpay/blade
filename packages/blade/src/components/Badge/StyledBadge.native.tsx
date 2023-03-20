import styled from 'styled-components/native';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledBadge = styled(BaseBox)<StyledBadgeProps>((props) => ({
  ...getStyledBadgeStyles(props),
  alignSelf: 'center',
}));

export { StyledBadge };
