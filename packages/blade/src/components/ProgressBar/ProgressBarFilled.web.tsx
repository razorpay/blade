import type { FlattenSimpleInterpolation } from 'styled-components';
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
    left: -10%;
    transform: scaleX(100%);
  }
  50% {
    transform: scaleX(500%);
  }
  100% {
    left: 110%;
    transform: scaleX(100%);
  }
`;

const pulseAnimationStyles = ({
  duration,
  easing,
  delay,
}: {
  duration: string;
  easing: string;
  delay: string;
}): FlattenSimpleInterpolation => css`
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: white;
  animation: ${pulse} ${duration} ${easing} infinite;
  animation-delay: ${delay};
`;

const BoxWithFilledIndeterminateTransition = styled(Box)<
  Pick<ProgressBarFilledProps, 'fillMotionDuration'>
>(({ theme, fillMotionDuration }) => {
  const duration = castWebType(makeMotionTime(getIn(theme.motion, fillMotionDuration)));
  const easing = 'linear'; // TODO: Add this in motion tokens

  return css`
    animation: ${slideAndScale} ${duration} ${easing} infinite;
    position: absolute;
    width: 5%;
    height: 100%;
  `;
});

const IndeterminateFilledContainer = styled(BoxWithFilledIndeterminateTransition)<
  Pick<ProgressBarFilledProps, 'backgroundColor' | 'progress'>
>(({ backgroundColor }) => ({
  backgroundColor,
}));

const IndeterminatePulseAnimation = styled(BoxWithFilledIndeterminateTransition)<
  Pick<
    ProgressBarFilledProps,
    'pulseMotionDuration' | 'pulseMotionDelay' | 'motionEasing' | 'variant'
  >
>(({ theme, pulseMotionDuration, pulseMotionDelay, motionEasing, variant }) => {
  const duration = castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDuration)));
  const easing = castWebType(getIn(theme.motion, motionEasing));
  const delay = castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDelay)));

  return variant === 'progress' ? pulseAnimationStyles({ duration, easing, delay }) : '';
});

const BoxWithFilledTransition = styled(Box)<
  Pick<ProgressBarFilledProps, 'fillMotionDuration' | 'motionEasing'>
>(({ theme, fillMotionDuration, motionEasing }) => ({
  transitionProperty: 'width',
  transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, fillMotionDuration))),
  transitionTimingFunction: castWebType(getIn(theme.motion, motionEasing)),
}));

const DeterminateFilledContainer = styled(BoxWithFilledTransition)<
  Pick<ProgressBarFilledProps, 'backgroundColor' | 'progress'>
>(({ backgroundColor, progress }) => ({
  backgroundColor,
  height: '100%',
  width: `${progress}%`,
}));

const DeterminatePulseAnimation = styled(BoxWithFilledTransition)<
  Pick<
    ProgressBarFilledProps,
    'pulseMotionDuration' | 'pulseMotionDelay' | 'motionEasing' | 'variant'
  >
>(({ theme, pulseMotionDuration, pulseMotionDelay, motionEasing, variant }) => {
  const duration = castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDuration)));
  const easing = castWebType(getIn(theme.motion, motionEasing));
  const delay = castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDelay)));

  return variant === 'progress' ? pulseAnimationStyles({ duration, easing, delay }) : '';
});

const ProgressBarFilled = ({
  backgroundColor,
  fillMotionDuration,
  motionEasing,
  progress,
  pulseMotionDelay,
  pulseMotionDuration,
  variant,
  isIndeterminate,
}: ProgressBarFilledProps): React.ReactElement => {
  const ProgressBarFilledContainer = isIndeterminate
    ? IndeterminateFilledContainer
    : DeterminateFilledContainer;
  const ProgressBarPulseAnimation = isIndeterminate
    ? IndeterminatePulseAnimation
    : DeterminatePulseAnimation;

  return (
    <ProgressBarFilledContainer
      backgroundColor={backgroundColor}
      fillMotionDuration={fillMotionDuration}
      progress={progress}
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

export { ProgressBarFilled };
