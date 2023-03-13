import styled from 'styled-components';
import type { Theme } from '../BladeProvider';
import { getAmountStyles } from './getAmountBadgeStyles';

const StyledAmount = styled.div<{ theme: Theme }>((props) => ({
  ...getAmountStyles(props),
}));

export { StyledAmount };
