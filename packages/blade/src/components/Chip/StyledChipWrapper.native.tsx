import styled from 'styled-components/native';
import type { StyledChipWrapperProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import type { StyledComponent } from 'styled-components';

const StyledChipWrapper: StyledComponent<typeof BaseBox, any, StyledChipWrapperProps> = styled(
  BaseBox,
)<StyledChipWrapperProps>(({ theme, borderColor, isChecked }) => {
  return {
    display: 'flex',
    borderColor: isChecked ? getIn(theme.colors, borderColor) : 'transparent',
  };
});

export { StyledChipWrapper };
