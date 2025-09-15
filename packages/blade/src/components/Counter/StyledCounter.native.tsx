import styled from 'styled-components/native';
import { getStyledCounterStyles } from './getStyledCounterStyles';
import type { StyledCounterProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import type { StyledComponent } from 'styled-components';

const StyledCounter: StyledComponent<typeof BaseBox, any, StyledCounterProps> = styled(
  BaseBox,
)<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  alignSelf: 'center',
}));

export { StyledCounter };
