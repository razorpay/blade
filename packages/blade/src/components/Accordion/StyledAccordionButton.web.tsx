import styled from 'styled-components';
import type { StyledAccordionButtonProps } from './types';
import {
  getBackgroundColor,
  getCommonAccordionButtonStyles,
  getTransitionDuration,
  getTransitionEasing,
} from './commonStyles';
import { castWebType } from '~utils';

const StyledAccordionButton = styled.button<StyledAccordionButtonProps>((props) => {
  const { theme, isExpanded } = props;
  const commonStyles = getCommonAccordionButtonStyles(props);
  return {
    ...commonStyles,
    backgroundColor: getBackgroundColor({ theme, isExpanded, isActive: false }),
    transitionProperty: 'background-color, box-shadow, border-radius, color',
    transitionDuration: castWebType(getTransitionDuration(theme)),
    transitionTimingFunction: castWebType(getTransitionEasing(theme)),
    cursor: 'pointer',
    color: theme.colors.surface.text.gray.muted,
    width: '100%',
    border: 'none',
    textAlign: 'left',

    '&:hover, &:focus-visible': {
      backgroundColor: getBackgroundColor({ theme, isExpanded, isActive: true }),
    },

    '&:hover': {
      color: theme.colors.interactive.icon.gray.subtle,
    },

    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0px 0px 0px 4px ${theme.colors.surface.border.primary.muted}`,
      // only need border radius on the focus ring
      borderRadius: theme.border.radius.small,
      color: theme.colors.interactive.icon.gray.subtle,
    },
  };
});

export { StyledAccordionButton };
