import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import React from 'react';
import type { CircularProgressBarFilledProps } from './types';
import {
  pulseAnimation,
  circularProgressSizeTokens,
  getCircularProgressSVGTokens,
} from './progressBarTokens';
import { CircularProgressLabel } from './CircularProgressLabel';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';
import type { TextProps } from '~components/Typography';
import { getTextProps } from '~components/Typography';
import { Svg, Circle } from '~components/Icons/_Svg';
import getBaseTextStyles from '~components/Typography/BaseText/getBaseTextStyles';

const pulseKeyframes = keyframes`
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

const getPulseAnimationStyles = ({
  duration,
  easing,
  progressPercent,
  isMeter,
}: {
  duration: string;
  easing: string;
  progressPercent: number;
  isMeter: boolean;
}): FlattenSimpleInterpolation => {
  if (isMeter || progressPercent === 100) {
    return css`
      height: 100%;
      width: 100%;
      transition: stroke-dashoffset ${duration} ${easing};
    `;
  }

  return css`
    height: 100%;
    width: 100%;
    opacity: ${pulseAnimation.opacityInitial};
    background-color: ${pulseAnimation.backgroundColor};
    transition: stroke-dashoffset ${duration} ${easing};
    animation: ${pulseKeyframes} ${duration} ${easing} infinite;
  `;
};

const StyledSVGText = styled.text<Pick<TextProps<{ variant: 'body' }>, 'size' | 'weight'>>(
  ({ theme, size, weight }) => {
    return {
      ...getBaseTextStyles({
        theme,
        ...getTextProps({ variant: 'body', size, weight }),
      }),
      fill: theme.colors.surface.text.gray.normal,
    };
  },
);

const DeterminatePulseAnimation = styled.circle<
  Pick<
    CircularProgressBarFilledProps,
    'pulseMotionDuration' | 'pulseMotionDelay' | 'motionEasing' | 'progressPercent' | 'isMeter'
  >
>(({ theme, pulseMotionDuration, motionEasing, progressPercent, isMeter }) => {
  const duration = castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDuration)));
  const easing = castWebType(getIn(theme.motion, motionEasing));

  return getPulseAnimationStyles({
    duration,
    easing,
    progressPercent,
    isMeter,
  });
});

const CircularProgressBarFilled = ({
  progressPercent,
  fillColor,
  backgroundColor,
  size = 'small',
  label,
  showPercentage = true,
  isMeter,
}: CircularProgressBarFilledProps): React.ReactElement => {
  const {
    sqSize,
    strokeWidth,
    radius,
    viewBox,
    dashArray,
    dashOffset,
  } = getCircularProgressSVGTokens({ size, progressPercent });

  return (
    <BaseBox
      width="fit-content"
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Svg width={String(sqSize)} height={String(sqSize)} viewBox={viewBox}>
        <Circle
          fill="none"
          stroke={backgroundColor}
          cx={String(sqSize / 2)}
          cy={String(sqSize / 2)}
          r={String(radius)}
          strokeWidth={`${strokeWidth}px`}
        />

        <DeterminatePulseAnimation
          progressPercent={progressPercent}
          isMeter={isMeter}
          fill="none"
          stroke={fillColor}
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          // Start progress marker at 12 O'Clock
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          pulseMotionDuration="duration.2xgentle"
          pulseMotionDelay="delay.long"
          motionEasing="easing.emphasized"
        />
        {showPercentage && size !== 'small' && (
          <StyledSVGText
            size={circularProgressSizeTokens[size].percentTextSize}
            weight="semibold"
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".4em"
          >
            {progressPercent}%
          </StyledSVGText>
        )}
      </Svg>

      <CircularProgressLabel
        progressPercent={progressPercent}
        size={size}
        label={label}
        showPercentage={showPercentage}
      />
    </BaseBox>
  );
};

export { CircularProgressBarFilled };
