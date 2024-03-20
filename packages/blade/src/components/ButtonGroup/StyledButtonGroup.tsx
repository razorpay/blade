import styled from 'styled-components';
import type { StyledButtonGroupProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';
import { getBackgroundColorToken } from '~components/Button/BaseButton/BaseButton';
import getIn from '~utils/lodashButBetter/get';

const StyledButtonGroup = styled(BaseBox)<StyledButtonGroupProps>(
  ({ theme, isDisabled, variant = 'primary', color, isFullWidth }) => {
    return {
      display: 'flex',
      width: isFullWidth ? '100%' : 'fit-content',
      overflow: 'hidden',
      borderRadius: makeBorderSize(theme.border.radius.medium),

      ...(variant === 'secondary' && {
        borderColor: getIn(
          theme.colors,
          getBackgroundColorToken({
            property: 'border',
            variant,
            color,
            state: isDisabled ? 'disabled' : 'default',
          }),
        ),
        borderStyle: 'solid',
        borderWidth: makeBorderSize(theme.border.width.thin),
      }),

      'button[role="button"]': {
        borderRadius: 0,
        border: 'none',
        flex: isFullWidth ? 1 : 'auto',
      },
    };
  },
);

export { StyledButtonGroup };
