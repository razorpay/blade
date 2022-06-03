import styled from 'styled-components';
import getIn from '../../../utils/getIn';
import makeMotionTime from '../../../utils/makeMotionTime';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton.d';

const StyledBaseButton = styled.button(
  ({ ...props }: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) => ({
    ...getBaseButtonStyles({
      ...props,
    }),
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    transitionDuration: makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
    '*': {
      transitionProperty: 'color, fill',
      transitionDuration: makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
      transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    },
  }),
);

export default StyledBaseButton;
