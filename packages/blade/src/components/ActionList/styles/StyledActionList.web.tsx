import type { DefaultTheme, StyledComponent } from 'styled-components';
import styled from 'styled-components';
import { getBaseActionListStyles } from './getBaseActionListStyles';
import type { StyledActionListProps } from './getBaseActionListStyles';
import BaseBox from '~components/Box/BaseBox';

const StyledActionList: StyledComponent<
  typeof BaseBox,
  DefaultTheme,
  StyledActionListProps
> = styled(BaseBox)<StyledActionListProps>((props) => {
  return {
    ...getBaseActionListStyles(props),
  };
});

export { StyledActionList };
