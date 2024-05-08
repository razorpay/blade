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
      borderWidth: makeBorderSize(theme.border.width.thin),
      borderRadius: makeBorderSize(theme.border.radius.medium),
      borderStyle: 'solid',
      borderColor: getIn(
        theme.colors,
        getBackgroundColorToken({
          // Only secondary variant has border a border, for other variants we use background color so that the border is not visible
          property: variant === 'secondary' ? 'border' : 'background',
          variant,
          color,
          state: isDisabled ? 'disabled' : 'default',
        }),
      ),

      'button[role="button"]': {
        borderRadius: 0,
        border: 'none',
        flex: isFullWidth ? 1 : 'auto',
      },
    };
  },
);

export { StyledButtonGroup };
