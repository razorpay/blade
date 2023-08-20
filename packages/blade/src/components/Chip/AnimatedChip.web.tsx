import styled from 'styled-components';
import getIn from 'lodash/get';
import { getAnimatedChipStyles } from './getAnimatedChipStyles';
import type { AnimatedChipProps } from './types';
import { chipMotionTokens } from './chipTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const AnimatedChip = styled(BaseBox)<AnimatedChipProps>((props) => {
  const easing = getIn(props.theme, chipMotionTokens.timingFunction);
  const duration = castWebType(makeMotionTime(getIn(props.theme, chipMotionTokens.duration)));
  return {
    ...getAnimatedChipStyles(props),
    width: 'fit-content',
    transform: `scale(${props.isPressed ? '0.8' : '1'})`,
    transitionDuration: duration,
    transitionTimingFunction: easing,
  };
});

export { AnimatedChip };
