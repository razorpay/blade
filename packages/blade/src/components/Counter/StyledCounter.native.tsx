import styled from 'styled-components/native';

import BaseBox from '~components/Box/BaseBox';

import { getStyledCounterStyles } from './getStyledCounterStyles';

import type { StyledCounterProps } from './types';

const StyledCounter = styled(BaseBox)<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  alignSelf: 'center',
}));

export { StyledCounter };
