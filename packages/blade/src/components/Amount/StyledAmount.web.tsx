import styled from 'styled-components';
import type { StyledAmountProps } from './types';

const StyledAmount = styled.div<StyledAmountProps>(() => ({
  width: 'fit-content',
}));

export { StyledAmount };
