import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Text as SVGText, Circle } from 'react-native-svg';
import type { CircularProgressBarFilledProps } from './types';
import { circularProgressSizeTokens, getCircularProgressSVGTokens } from './progressBarTokens';
import { CircularProgressLabel } from './CircularProgressLabel';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import type { TextProps } from '~components/Typography';
import { getTextProps } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';
import { Svg } from '~components/Icons/_Svg';
import getBaseTextStyles from '~components/Typography/BaseText/getBaseTextStyles';

const pulseAnimation = {
  opacityInitial: 1,
  opacityMid: 0.65,
  opacityFinal: 1,
};

const StyledSVGText = styled(SVGText)<Pick<TextProps<{ variant: 'body' }>, 'size' | 'weight'>>(
  ({ theme, size, weight }) => {
    const textProps = getTextProps({ variant: 'body', size, weight });

    return {
      ...getBaseTextStyles({ theme, ...textProps }),
      strokeWidth: 0,
      fill:
        textProps.color === 'currentColor'
          ? textProps.color
          : getIn(theme.colors, textProps.color!),
    };
  },
);

const CircularProgressBarFilled = ({
  progressPercent,
  fillColor,
  backgroundColor,
  size = 'small',
  label,
  showPercentage = true,
  isMeter,
  motionEasing,
  pulseMotionDuration,
  pulseMotionDelay,
  fillMotionDuration,
}: CircularProgressBarFilledProps): React.ReactElement => {
  const {
    sqSize,
    strokeWidth,
    radius,
    viewBox,
    dashArray,
    dashOffset,
  } = getCircularProgressSVGTokens({ size, progressPercent });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedOpacity = useSharedValue(pulseAnimation.opacityInitial);
  const animatedStrokeDashoffset = useSharedValue(dashOffset);
  const { theme } = useTheme();
  const fillAndPulseEasing = getIn(theme.motion, motionEasing);
  const pulseDuration =
    castNativeType(makeMotionTime(getIn(theme.motion, pulseMotionDuration))) / 2;

  // Trigger animation for progress fill
  useEffect(() => {
    const fillDuration = castNativeType(makeMotionTime(getIn(theme.motion, fillMotionDuration)));
    animatedStrokeDashoffset.value = withTiming(dashOffset, {
      duration: fillDuration,
      easing: fillAndPulseEasing,
    });
    return () => {
      cancelAnimation(animatedStrokeDashoffset);
    };
  }, [dashOffset, animatedStrokeDashoffset, fillMotionDuration, theme, fillAndPulseEasing]);

  // Trigger pulsating animation
  useEffect(() => {
    const pulsatingAnimationTimingConfig = {
      duration: pulseDuration,
      easing: fillAndPulseEasing,
    };
    if (!isMeter) {
      animatedOpacity.value = withDelay(
        castNativeType(makeMotionTime(getIn(theme.motion, pulseMotionDelay))),
        withRepeat(
          withSequence(
            withTiming(pulseAnimation.opacityMid, pulsatingAnimationTimingConfig),
            withTiming(pulseAnimation.opacityFinal, pulsatingAnimationTimingConfig),
          ),
          -1,
        ),
      );
    }

    return () => {
      cancelAnimation(animatedOpacity);
    };
  }, [animatedOpacity, fillAndPulseEasing, pulseDuration, pulseMotionDelay, theme, isMeter]);

  const firstIndicatorStyles = useAnimatedStyle(() => {
    return {
      strokeDashoffset: animatedStrokeDashoffset.value,
      opacity: progressPercent < 100 ? animatedOpacity.value : 1,
    };
  });

  return (
    <BaseBox display="flex" width="fit-content" alignItems="center">
      <Svg width={String(sqSize)} height={String(sqSize)} viewBox={viewBox}>
        <Circle
          fill="none"
          stroke={backgroundColor}
          cx={String(sqSize / 2)}
          cy={String(sqSize / 2)}
          r={String(radius)}
          strokeWidth={`${strokeWidth}px`}
        />

        <AnimatedCircle
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
          style={firstIndicatorStyles}
        />

        {showPercentage && size !== 'small' && (
          <StyledSVGText
            size={circularProgressSizeTokens[size].percentTextSize}
            weight="semibold"
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".5em"
          >
            {`${progressPercent}%`}
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
