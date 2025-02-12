import styled from 'styled-components';
import { getAnimatedChipStyles } from './getAnimatedChipStyles';
import type { AnimatedChipProps } from './types';
import { chipMotionTokens } from './chipTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';
import { useTheme } from '~components/BladeProvider';

const AnimatedChip = styled(BaseBox)<AnimatedChipProps>((props) => {
  const easing = getIn(props.theme.motion, chipMotionTokens.easing);
  const duration = castWebType(
    makeMotionTime(getIn(props.theme.motion, chipMotionTokens.duration)),
  );
  const { theme } = useTheme();
  const animatedChipStyles = getBaseBoxStyles({
    width: props?.width,
    maxWidth: props?.maxWidth,
    minWidth: props?.minWidth,
    theme,
  });

  return {
    ...getAnimatedChipStyles(props),
    ...animatedChipStyles,
    ...(!props?.width && {
      width: 'fit-content',
    }),
    transform: `scale(${props.isPressed ? '0.92' : '1'})`,
    transitionDuration: duration,
    transitionTimingFunction: easing,
  };
});

export { AnimatedChip };
