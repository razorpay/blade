import styled from 'styled-components/native';
import { getStyledCounterStyles } from './getStyledCounterStyles';
import type { StyledCounterProps } from './types';

const StyledCounter = styled.View<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  alignSelf: 'center',
}));

export { StyledCounter };
