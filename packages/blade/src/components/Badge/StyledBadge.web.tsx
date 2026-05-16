import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';

import { getStyledBadgeStyles } from './getStyledBadgeStyles';

import type { StyledBadgeProps } from './types';

const StyledBadge = styled(BaseBox)<StyledBadgeProps>((props) => ({
  ...getStyledBadgeStyles(props),
  width: 'fit-content',
}));

export { StyledBadge };
