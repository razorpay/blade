import styled from 'styled-components';
import { getStyledAmountStyles } from './getStyledAmountStyles';
import type { StyledAmountProps } from './types';

const StyledAmount = styled.div<StyledAmountProps>((props) => ({
  ...getStyledAmountStyles(props),
  width: 'fit-content',
}));

export { StyledAmount };
