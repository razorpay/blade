import styled from 'styled-components/native';
import type { DefaultTheme, StyledComponent } from 'styled-components';
import { getStyledCounterStyles } from './getStyledCounterStyles';
import type { StyledCounterProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledCounter: StyledComponent<typeof BaseBox, DefaultTheme, StyledCounterProps> = styled(
  BaseBox,
)<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  alignSelf: 'center',
}));

export { StyledCounter };
