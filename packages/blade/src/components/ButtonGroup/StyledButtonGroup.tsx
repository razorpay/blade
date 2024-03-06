import styled from 'styled-components';
import type { StyledButtonGroupProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const StyledButtonGroup = styled(BaseBox)<StyledButtonGroupProps>(
  ({ theme, isDisabled, variant }) => {
    return {
      display: 'flex',
      width: 'fit-content',
      overflow: 'hidden',
      borderRadius: makeBorderSize(theme.border.radius.medium),

      ...(variant === 'secondary' && {
        borderWidth: makeBorderSize(theme.border.width.thin),
        borderColor: 'blue',
        borderStyle: 'solid',
        //border: '1px Solid blue',
        //borderRight: 'none',
      }),

      'button[role="button"]': {
        borderRadius: 0,
        border: 'none',
        ...(variant === 'secondary' &&
          {
            //borderRight: '1px solid blue',
          }),
      },
    };
  },
);

export { StyledButtonGroup };
