import styled from 'styled-components/native';
import { getStyledCounterStyles } from './getStyledCounterStyles';
import type { StyledCounterProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledCounter = styled(BaseBox)<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  alignSelf: 'center',
}));

export { StyledCounter };
