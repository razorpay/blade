import styled from 'styled-components';
import type { StyledButtonGroupProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const StyledButtonGroup = styled(BaseBox)<StyledButtonGroupProps>(
  ({ theme, variant = 'primary', isFullWidth }) => {
    return {
      display: 'flex',
      width: isFullWidth ? '100%' : 'fit-content',
      borderWidth: makeBorderSize(theme.border.width.thin),
      borderRadius: makeBorderSize(theme.border.radius.medium),
      borderStyle: 'solid',
      borderColor: 'transparent',
      overflow: 'hidden',
      'button[role="button"]': {
        flex: isFullWidth ? 1 : 'auto',
      },

      ...(variant === 'secondary' && {
        'button[role="button"]:first-child': {
          borderRight: 'none',
          borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
          borderBottomLeftRadius: makeBorderSize(theme.border.radius.medium),
        },
        'button[role="button"]:not(:first-child):not(:last-child)': {
          borderLeft: 'none',
          borderRight: 'none',
        },
        'button[role="button"]:last-child': {
          borderLeft: 'none',
          borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
          borderBottomRightRadius: makeBorderSize(theme.border.radius.medium),
        },
      }),
    };
  },
);

export { StyledButtonGroup };
