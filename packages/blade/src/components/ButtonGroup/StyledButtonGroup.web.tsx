import styled from 'styled-components';
import type { StyledButtonGroupProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';
import { buttonBorderRadius } from '~components/Button/BaseButton/buttonTokens';

const StyledButtonGroup = styled(BaseBox)<StyledButtonGroupProps>(
  ({ theme, variant = 'primary', isFullWidth, size = 'medium' }) => {
    const borderRadiusToken = buttonBorderRadius[size];
    const borderRadius = makeBorderSize(theme.border.radius[borderRadiusToken]);
    const isSecondaryOrTertiary = variant === 'secondary' || variant === 'tertiary';

    return {
      display: 'flex',
      width: isFullWidth ? '100%' : 'fit-content',
      borderWidth: makeBorderSize(theme.border.width.thin),
      borderRadius,
      borderStyle: 'solid',
      borderColor: 'transparent',
      overflow: 'hidden',
      'button[role="button"]': {
        flex: isFullWidth ? 1 : 'auto',
        borderRadius: 0,
      },

      // Handles both direct buttons and buttons wrapped in components like Dropdown
      '> button[role="button"]:first-child, > *:first-child button[role="button"]': {
        borderRight: 'none',
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
      },

      // Targets middle buttons, whether direct children or wrapped in container elements
      '> button[role="button"]:not(:first-child):not(:last-child), > *:not(:first-child):not(:last-child) button[role="button"]': {
        borderLeft: 'none',
        borderRight: 'none',
      },

      // Handles last button in group, accounting for wrapper components like Dropdown
      '> button[role="button"]:last-child, > *:last-child button[role="button"]': {
        borderLeft: 'none',
        borderTopRightRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      },

      // Remove radial gradient from all buttons except the first one
      '> button[role="button"]:not(:first-child), > *:not(:first-child) button[role="button"]': {
        backgroundImage: 'none',
      },

      // For secondary/tertiary variants, use negative margin to collapse double borders
      // (these variants have borders via box-shadow, so adjacent buttons would show double borders)
      ...(isSecondaryOrTertiary && {
        '> button[role="button"]:not(:first-child), > *:not(:first-child) button[role="button"]': {
          marginLeft: '-1px',
          backgroundImage: 'none',
        },
      }),
    };
  },
);

export { StyledButtonGroup };
