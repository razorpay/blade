import styled from 'styled-components';
import getIn from 'lodash/get';
import { getAnimatedChipStyles } from './getAnimatedChipStyles';
import type { AnimatedChipProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';

const AnimatedChip = styled(BaseBox)<AnimatedChipProps>((props) => {
  const easing = getIn(props.theme, 'motion.easing.standard.effective');
  const duration = makeMotionTime(getIn(props.theme, 'motion.duration.xquick'));
  return {
    ...getAnimatedChipStyles(props),
    width: 'fit-content',
    transform: `scale(${props.isPressed ? '0.8' : '1'})`,
    transitionDuration: duration,
    transitionTimingFunction: easing,
  };
});

export { AnimatedChip };
