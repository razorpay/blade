import styled from 'styled-components';
import { getBaseActionListStyles } from './getBaseActionListStyles';
import type { StyledActionListProps } from './getBaseActionListStyles';
import Box from '~components/Box';

const StyledActionList = styled(Box)<StyledActionListProps>((props) => {
  return {
    ...getBaseActionListStyles(props),
  };
});

export { StyledActionList };
