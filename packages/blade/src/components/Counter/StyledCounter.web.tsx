import styled from 'styled-components';
import { getStyledCounterStyles } from './getStyledCounterStyles';
import type { StyledCounterProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledCounter = styled(BaseBox)<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  width: 'fit-content',
}));

export { StyledCounter };
