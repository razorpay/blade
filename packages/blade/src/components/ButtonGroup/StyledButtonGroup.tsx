import styled from 'styled-components';
import type { StyledButtonGroupProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const StyledButtonGroup = styled(BaseBox)<StyledButtonGroupProps>(({ theme, isDisabled }) => {
  return {
    display: 'flex',
    width: 'fit-content',
    overflow: 'hidden',
    borderRadius: makeBorderSize(theme.border.radius.medium),
    'button[role="button"]': {
      borderRadius: 0,
    },
  };
});

export { StyledButtonGroup };
