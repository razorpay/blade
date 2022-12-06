import styled, { css, keyframes } from 'styled-components';
import type { ProgressBarFilledProps } from './types';
import Box from '~components/Box';
import { castWebType, getIn, makeMotionTime } from '~utils';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.65;
  }
  100% {
    opacity: 1;
  }
`;

const ProgressBarFilledWithFillAnimation = styled(Box)<ProgressBarFilledProps>(
  ({ backgroundColor, theme, progress, fillMotionDuration, motionEasing }) => ({
    backgroundColor,
    height: '100%',
    width: `${progress}%`,
    transitionProperty: 'width',
    transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, fillMotionDuration))),
    transitionTimingFunction: castWebType(getIn(theme.motion, motionEasing)),
  }),
);

const ProgressBarFilledWithPulseAnimation = styled(
  ProgressBarFilledWithFillAnimation,
)<ProgressBarFilledProps>(
  ({ theme, pulseMotionDuration, pulseMotionDelay, motionEasing, variant }) =>
    variant === 'progress'
      ? css`
          animation: ${pulse}
            ${castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDuration)))}
            ${castWebType(getIn(theme.motion, motionEasing))} infinite;
          animation-delay: ${castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDelay)))};
        `
      : '',
);

export { ProgressBarFilledWithPulseAnimation as ProgressBarFilled };
