import styled from 'styled-components';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledBadge = styled(BaseBox)<StyledBadgeProps>((props) => ({
  all: 'unset',
  ...getStyledBadgeStyles(props),
  width: 'fit-content',
}));

export { StyledBadge };
