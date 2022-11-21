import styled from 'styled-components';
import { getStyledCounterStyles } from './getStyledCounterStyles';
import type { StyledCounterProps } from './types';

const StyledCounter = styled.div<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  width: 'fit-content',
}));

export { StyledCounter };
