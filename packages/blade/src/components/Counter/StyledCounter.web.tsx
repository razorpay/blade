import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';

import { getStyledCounterStyles } from './getStyledCounterStyles';

import type { StyledCounterProps } from './types';

const StyledCounter = styled(BaseBox)<StyledCounterProps>((props) => ({
  ...getStyledCounterStyles(props),
  width: 'fit-content',
}));

export { StyledCounter };
