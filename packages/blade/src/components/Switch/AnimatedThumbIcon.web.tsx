import styled from 'styled-components';
import { switchMotion } from './switchTokens';
import getIn from '~utils/lodashButBetter/get';
import Svg from '~components/Icons/_Svg';
import { makeMotionTime } from '~utils/makeMotionTime';

const AnimatedThumbIcon = styled(Svg)<{ isChecked?: boolean }>(({ isChecked, theme }) => {
  const easing = getIn(theme, switchMotion.easing.thumbIcon);
  const duration = getIn(theme, switchMotion.duration.thumbIcon);

  return {
    transitionDuration: `${makeMotionTime(duration)}`,
    transitionTimingFunction: easing,
    transitionDelay: isChecked ? `${makeMotionTime(theme.motion.delay['2xquick'])}` : `0ms`,
    opacity: isChecked ? 1 : 0,
  };
});

export { AnimatedThumbIcon };
