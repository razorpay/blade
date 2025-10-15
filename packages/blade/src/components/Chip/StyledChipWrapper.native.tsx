import styled from 'styled-components/native';
import type { DefaultTheme, StyledComponent } from 'styled-components';
import type { StyledChipWrapperProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';

const StyledChipWrapper: StyledComponent<
  typeof BaseBox,
  DefaultTheme,
  StyledChipWrapperProps
> = styled(BaseBox)<StyledChipWrapperProps>(({ theme, borderColor, isChecked }) => {
  return {
    display: 'flex',
    borderColor: isChecked ? getIn(theme.colors, borderColor) : 'transparent',
  };
});

export { StyledChipWrapper };
