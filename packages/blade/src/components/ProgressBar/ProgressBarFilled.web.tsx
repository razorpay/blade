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

const BoxWithProgressBarFilledTransition = styled(Box)<
  Pick<ProgressBarFilledProps, 'fillMotionDuration' | 'motionEasing'>
>(({ theme, fillMotionDuration, motionEasing }) => ({
  transitionProperty: 'width',
  transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, fillMotionDuration))),
  transitionTimingFunction: castWebType(getIn(theme.motion, motionEasing)),
}));

const ProgressBarFilledContainer = styled(BoxWithProgressBarFilledTransition)<
  Pick<ProgressBarFilledProps, 'backgroundColor' | 'progress'>
>(({ backgroundColor, progress }) => ({
  backgroundColor,
  height: '100%',
  width: `${progress}%`,
}));

const ProgressBarPulseAnimation = styled(BoxWithProgressBarFilledTransition)<
  Pick<
    ProgressBarFilledProps,
    'pulseMotionDuration' | 'pulseMotionDelay' | 'motionEasing' | 'variant'
  >
>(({ theme, pulseMotionDuration, pulseMotionDelay, motionEasing, variant }) =>
  variant === 'progress'
    ? css`
        height: 100%;
        width: 100%;
        opacity: 0;
        background-color: white;
        animation: ${pulse} ${castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDuration)))}
          ${castWebType(getIn(theme.motion, motionEasing))} infinite;
        animation-delay: ${castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDelay)))};
      `
    : '',
);

const ProgressBarFilled = ({
  backgroundColor,
  fillMotionDuration,
  motionEasing,
  progress,
  pulseMotionDelay,
  pulseMotionDuration,
  variant,
}: ProgressBarFilledProps): React.ReactElement => {
  return (
    <ProgressBarFilledContainer
      backgroundColor={backgroundColor}
      fillMotionDuration={fillMotionDuration}
      motionEasing={motionEasing}
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
