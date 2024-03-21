import styled from 'styled-components';
import type { AnimatedButtonContentProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';

const AnimatedButtonContent = styled(BaseBox)<AnimatedButtonContentProps>((props) => {
  return {
    transform: `scale(${props.isPressed ? '0.95' : '1'})`,
    transitionDuration: getIn(props.theme.motion, props.motionEasing),
    transitionTimingFunction: getIn(props.theme.motion, props.motionDuration),
  };
});

export default AnimatedButtonContent;
