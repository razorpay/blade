import styled from 'styled-components';
import type { AnimatedButtonContentProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';

const AnimatedButtonContent = styled(BaseBox)<
  Pick<AnimatedButtonContentProps, 'motionDuration' | 'motionEasing' | 'isPressed'>
>((props) => {
  return {
    transform: 'scale(1)',
    transitionProperty: 'transform',
    transitionDuration: getIn(props.theme.motion, props.motionDuration),
    transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    // Use CSS :active to handle pressed state instead of React state
    'button:active &': {
      transform: 'scale(0.95)',
    },
    // Also handle when button is rendered as anchor tag
    'a:active &': {
      transform: 'scale(0.95)',
    },
  };
});

export default AnimatedButtonContent;
