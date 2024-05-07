import styled from 'styled-components';
import type { StyledAccordionButtonProps } from './types';
import {
  getBackgroundColor,
  getCommonAccordionButtonStyles,
  getTransitionDuration,
  getTransitionEasing,
} from './commonStyles';
import { castWebType } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const StyledAccordionButton = styled.button<StyledAccordionButtonProps>((props) => {
  const { theme, isExpanded, disabled } = props;
  const commonStyles = getCommonAccordionButtonStyles(props);
  return {
    ...commonStyles,
    backgroundColor: getBackgroundColor({ theme, isExpanded, isActive: false }),
    transitionProperty: 'background-color, box-shadow, border-radius, color',
    transitionDuration: castWebType(getTransitionDuration(theme)),
    transitionTimingFunction: castWebType(getTransitionEasing(theme)),
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: theme.colors.interactive.icon.gray[isExpanded ? 'subtle' : 'muted'],
    width: '100%',
    border: 'none',
    textAlign: 'left',

    '&:hover, &:focus-visible': {
      backgroundColor: getBackgroundColor({ theme, isExpanded, isActive: true }),
      color: theme.colors.interactive.icon.gray.subtle,
    },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      // only need border radius on the focus ring
      borderRadius: theme.border.radius.small,
    },
  };
});

export { StyledAccordionButton };
