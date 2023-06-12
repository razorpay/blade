import styled from 'styled-components';
import type { StyledAccordionButtonProps } from './types';
import { castWebType, makeMotionTime } from '~utils';

// TODO: refactor common tokens after native implementation
const StyledAccordionButton = styled.div<StyledAccordionButtonProps>((props) => {
  const { theme, isExpanded } = props;
  return {
    backgroundColor: isExpanded ? theme.colors.brand.gray.a50.lowContrast : undefined,
    padding: theme.spacing[5],
    transitionProperty: 'background-color, box-shadow, border-radius',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
    transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: theme.colors.surface.action.icon.default.lowContrast,

    '&:hover, &:focus': {
      backgroundColor: isExpanded
        ? theme.colors.brand.gray.a100.lowContrast
        : theme.colors.brand.gray.a50.lowContrast,
    },

    '&:hover': {
      color: theme.colors.surface.action.icon.hover.lowContrast,
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
      // only need border radius on the focus ring
      borderRadius: theme.border.radius.small,
      color: theme.colors.surface.action.icon.focus.lowContrast,
    },
  };
});

export { StyledAccordionButton };
