import styled from 'styled-components/native';
import type { StyledAmountProps } from './types';

const StyledAmount = styled.View<StyledAmountProps>(() => ({
  alignSelf: 'center',
}));

export { StyledAmount };
