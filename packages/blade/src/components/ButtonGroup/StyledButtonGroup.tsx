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
      borderRadius: makeBorderSize(theme.border.radius.medium),
      borderWidth: makeBorderSize(theme.border.width.thin),
      borderColor: getIn(
        theme.colors,
        getBackgroundColorToken({
          property: variant === 'tertiary' ? 'background' : 'border',
          variant,
          color,
          state: isDisabled ? 'disabled' : 'default',
        }),
      ),
      borderStyle: 'solid',

      'button[role="button"]': {
        borderRadius: 0,
        border: 'none',
        width: 'max-content',
        flex: isFullWidth ? 1 : 'auto',
      },
    };
  },
);

export { StyledButtonGroup };
