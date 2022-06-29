import styled from 'styled-components';
import getIn from '../../../utils/getIn';
import makeMotionTime from '../../../utils/makeMotionTime';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton.d';

const StyledBaseButton = styled.button<Omit<StyledBaseButtonProps, 'onClick'>>((props) => ({
  ...getStyledBaseButtonStyles(props),
  transitionProperty: 'background-color, border-color, box-shadow',
  transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
  transitionDuration: makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
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
    transitionDuration: makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
    transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
  },
}));

export default StyledBaseButton;
