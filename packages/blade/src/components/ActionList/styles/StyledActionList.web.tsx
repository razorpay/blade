import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';

import { getBaseActionListStyles } from './getBaseActionListStyles';

import type { StyledActionListProps } from './getBaseActionListStyles';

const StyledActionList = styled(BaseBox)<StyledActionListProps>((props) => {
  return {
    ...getBaseActionListStyles(props),
  };
});

export { StyledActionList };
