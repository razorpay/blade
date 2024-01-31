import styled from 'styled-components';
import { getAnimatedChipStyles } from './getAnimatedChipStyles';
import type { AnimatedChipProps } from './types';
import { chipMotionTokens } from './chipTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const AnimatedChip = styled(BaseBox)<AnimatedChipProps>((props) => {
  const easing = getIn(props.theme.motion, chipMotionTokens.easing);
  const duration = castWebType(
    makeMotionTime(getIn(props.theme.motion, chipMotionTokens.duration)),
  );
  return {
    ...getAnimatedChipStyles(props),
    width: 'fit-content',
    transform: `scale(${props.isPressed ? '0.92' : '1'})`,
    transitionDuration: duration,
    transitionTimingFunction: easing,
  };
});

export { AnimatedChip };
