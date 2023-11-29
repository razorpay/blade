import styled from 'styled-components';
import { getBaseActionListStyles } from './getBaseActionListStyles';
import type { StyledActionListProps } from './getBaseActionListStyles';
import BaseBox from '~components/Box/BaseBox';

const StyledActionList = styled(BaseBox)<StyledActionListProps>((props) => {
  return {
    ...getBaseActionListStyles(props),
  };
});

export { StyledActionList };
