import styled from 'styled-components';
import type { StyledAccordionButtonProps } from './types';
import { castWebType, makeMotionTime } from '~utils';

// TODO: refactor common tokens after native implementation
// TODO: svg icon colors based on state
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

    '&:hover, &:focus': {
      backgroundColor: isExpanded
        ? theme.colors.brand.gray.a100.lowContrast
        : theme.colors.brand.gray.a50.lowContrast,
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
      // only need border radius on the focus ring
      borderRadius: theme.border.radius.small,
    },
  };
});

export { StyledAccordionButton };
