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
        borderRadius: 0,
      },

      ...(variant === 'secondary' && {
        // Handles both direct buttons and buttons wrapped in components like Dropdown
        '> button[role="button"]:first-child, > *:first-child button[role="button"]': {
          borderRight: 'none',
          borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
          borderBottomLeftRadius: makeBorderSize(theme.border.radius.medium),
        },
        // Targets middle buttons, whether direct children or wrapped in container elements
        '> button[role="button"]:not(:first-child):not(:last-child), > *:not(:first-child):not(:last-child) button[role="button"]': {
          borderLeft: 'none',
          borderRight: 'none',
        },
        // Handles last button in group, accounting for wrapper components like Dropdown
        '> button[role="button"]:last-child, > *:last-child button[role="button"]': {
          borderLeft: 'none',
          borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
          borderBottomRightRadius: makeBorderSize(theme.border.radius.medium),
        },
      }),
    };
  },
);

export { StyledButtonGroup };
