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
  const { theme, isExpanded, disabled, variant, isFirstItem, isLastItem } = props;
  const commonStyles = getCommonAccordionButtonStyles(props);

  // Calculate border radius for filled variant only
  const getHoverBorderRadius = (): Record<string, string> => {
    if (variant !== 'filled') return {};

    const radius = castWebType(theme.border.radius.medium);

    if (isFirstItem && isLastItem) {
      // Single item: full radius when closed, only top radius when expanded
      if (isExpanded) {
        return {
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
        };
      }
      return { borderRadius: radius };
    }

    if (isFirstItem) {
      return {
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
      };
    }

    if (isLastItem && !isExpanded) {
      return {
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
      };
    }

    return {};
  };

  return {
    ...commonStyles,
    backgroundColor: getBackgroundColor({ theme, isActive: false }),
    transitionProperty: 'background-color, box-shadow, border-radius, color',
    transitionDuration: castWebType(getTransitionDuration(theme)),
    transitionTimingFunction: castWebType(getTransitionEasing(theme)),
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: theme.colors.interactive.icon.gray[isExpanded ? 'subtle' : 'muted'],
    width: '100%',
    border: 'none',
    textAlign: 'left',

    '&:hover, &:focus-visible': {
      backgroundColor: getBackgroundColor({ theme, isActive: true }),
      color: theme.colors.interactive.icon.gray.subtle,
      ...getHoverBorderRadius(),

      '& [data-blade-component="divider"]': {
        opacity: 0,
      },
    },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      // only need border radius on the focus ring
      borderRadius: theme.border.radius.small,
    },
  };
});

export { StyledAccordionButton };
