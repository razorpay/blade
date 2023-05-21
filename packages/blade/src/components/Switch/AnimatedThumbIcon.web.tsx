import styled from 'styled-components';
import Svg from '~components/Icons/_Svg';
import { makeMotionTime } from '~utils';

const AnimatedThumbIcon = styled(Svg)<{ isChecked?: boolean }>(({ isChecked, theme }) => {
  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.xquick)}`,
    transitionTimingFunction: theme.motion.easing.standard.effective as string,
    transitionDelay: isChecked ? `${makeMotionTime(theme.motion.delay['2xshort'])}` : `0ms`,
    opacity: isChecked ? 1 : 0,
  };
});

export { AnimatedThumbIcon };
