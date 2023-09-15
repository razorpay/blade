import styled from 'styled-components/native';
import getIn from 'lodash/get';
import type { StyledChipWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledChipWrapper = styled(BaseBox)<StyledChipWrapperProps>(
  ({ theme, borderColor, isChecked }) => {
    return {
      display: 'flex',
      borderColor: isChecked ? getIn(theme.colors, borderColor) : 'transparent',
    };
  },
);

export { StyledChipWrapper };
