import styled from 'styled-components/native';

import BaseBox from '~components/Box/BaseBox';

import { getStyledBadgeStyles } from './getStyledBadgeStyles';

import type { StyledBadgeProps } from './types';

const StyledBadge = styled(BaseBox)<StyledBadgeProps>((props) => ({
  ...getStyledBadgeStyles(props),
  alignSelf: 'center',
}));

export { StyledBadge };
