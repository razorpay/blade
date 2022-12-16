import styled, { css, keyframes } from 'styled-components';
import React from 'react';
import type { ProgressBarFilledProps } from './types';
import Box from '~components/Box';
import { castWebType, getIn, makeMotionTime } from '~utils';

const pulse = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.25;
  }
  100% {
    opacity: 0;
  }
`;

const slideAndScale = keyframes`
  0% {
    left: -30px;
    transform: scaleX(100%);
  }
  50% {
    left: 50%;
    transform: scaleX(500%);
  }
  100% {
    left: 100%;
    transform: translateX(calc(-100% + 30px)) scaleX(100%);
  }
`;

const BoxWithProgressBarFilledTransition = styled(Box)<
  Pick<ProgressBarFilledProps, 'fillMotionDuration' | 'motionEasing'>
>(({ theme, fillMotionDuration, motionEasing }) => {
  const duration = castWebType(makeMotionTime(getIn(theme.motion, fillMotionDuration)));
  // const easing = castWebType(getIn(theme.motion, motionEasing));
  const easing = 'linear';

  return css`
    animation: ${slideAndScale} ${duration} ${easing} infinite;
    position: absolute;
    width: 5%;
    height: 100%;
  `;
});

const ProgressBarFilledContainer = styled(BoxWithProgressBarFilledTransition)<
  Pick<ProgressBarFilledProps, 'backgroundColor'>
>(({ backgroundColor }) => ({
  backgroundColor,
}));

const ProgressBarPulseAnimation = styled(BoxWithProgressBarFilledTransition)<
  Pick<
    ProgressBarFilledProps,
    'pulseMotionDuration' | 'pulseMotionDelay' | 'motionEasing' | 'variant'
  >
>(({ theme, pulseMotionDuration, pulseMotionDelay, motionEasing, variant }) => {
  const duration = castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDuration)));
  const easing = castWebType(getIn(theme.motion, motionEasing));
  const delay = castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDelay)));

  return variant === 'progress'
    ? css`
        height: 100%;
        width: 100%;
        opacity: 0;
        background-color: white;
        animation: ${pulse} ${duration} ${easing} infinite;
        animation-delay: ${delay};
      `
    : '';
});

const ProgressBarFilledIndeterminate = ({
  backgroundColor,
  fillMotionDuration,
  motionEasing,
  pulseMotionDelay,
  pulseMotionDuration,
  variant,
}: ProgressBarFilledProps): React.ReactElement => {
  return (
    <ProgressBarFilledContainer
      backgroundColor={backgroundColor}
      fillMotionDuration={fillMotionDuration}
      motionEasing={motionEasing}
    >
      <ProgressBarPulseAnimation
        fillMotionDuration={fillMotionDuration}
        motionEasing={motionEasing}
        variant={variant}
        pulseMotionDelay={pulseMotionDelay}
        pulseMotionDuration={pulseMotionDuration}
      />
    </ProgressBarFilledContainer>
  );
};

export { ProgressBarFilledIndeterminate };
