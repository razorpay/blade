import type { StyledComponent } from 'styled-components';
import styled from 'styled-components';
import { getStyledCounterStyles } from './getStyledCounterStyles';
import type { StyledCounterProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledCounter: StyledComponent<typeof BaseBox, any, StyledCounterProps, never> = styled(
  BaseBox,
)<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  width: 'fit-content',
}));

export { StyledCounter };
