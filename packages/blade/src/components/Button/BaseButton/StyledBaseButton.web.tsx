import getIn from 'lodash/get';
import styled from 'styled-components';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { StyledBaseButtonProps } from './types';
import { castWebType, makeMotionTime } from '~utils';
import { useStyledProps } from '~components/Box/styledProps';

const StyledBaseButton = styled.button.attrs((props: StyledBaseButtonProps) => ({
  ...props.accessibilityProps,
}))<Omit<StyledBaseButtonProps, 'onClick'>>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return {
    ...getStyledBaseButtonStyles(props),
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    transitionDuration: castWebType(
      makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
    ),
    position: 'relative',
    '&:hover': {
      backgroundColor: props.hoverBackgroundColor,
      borderColor: props.hoverBorderColor,
    },
    '&:active': {
      backgroundColor: props.activeBackgroundColor,
      borderColor: props.activeBorderColor,
    },
    '&:focus': {
      backgroundColor: props.focusBackgroundColor,
      borderColor: props.focusBorderColor,
      boxShadow: `0px 0px 0px 4px ${props.focusRingColor}`,
      outline: 'none',
    },
    '*': {
      transitionProperty: 'color, fill',
      transitionDuration: castWebType(
        makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
      ),
      transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    },
    ...styledPropsCSSObject,
  };
});

export default StyledBaseButton;
