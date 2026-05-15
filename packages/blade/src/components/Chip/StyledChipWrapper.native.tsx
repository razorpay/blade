import styled from 'styled-components/native';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';

import type { StyledChipWrapperProps } from './types';

const StyledChipWrapper = styled(BaseBox)<StyledChipWrapperProps>(
  ({ theme, borderColor, isChecked }) => {
    return {
      display: 'flex',
      borderColor: isChecked ? getIn(theme.colors, borderColor) : 'transparent',
    };
  },
);

export { StyledChipWrapper };
