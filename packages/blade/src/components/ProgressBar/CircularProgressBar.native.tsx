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
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { CircularProgressBarFilledProps } from './types';
import { circularProgressSizeTokens } from './progressBarTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';

// The actual transparent color is '#00000000', but it is not working in android so using '#00000001' as a workaround
// Related Issue - https://github.com/facebook/react-native/issues/34722
const TRANSPARENT = '#00000001';

const pulseAnimation = {
  opacityInitial: 1,
  opacityMid: 0.65,
  opacityFinal: 1,
};

const BaseCircle = styled(Animated.View)<{ size: number; borderWidth?: number }>(
  ({ size, borderWidth }) => ({
    height: size,
    width: size,
    borderRadius: size / 2,
    borderWidth,
  }),
);

const EmptyCircle = styled(BaseCircle)<{ color: string }>(({ color }) => ({
  borderColor: color,
  justifyContent: 'center',
  alignItems: 'center',
  transform: 'rotate(-45deg)',
}));

const Indicator = styled(BaseCircle)<{ color: string }>(({ color }) => ({
  position: 'absolute',
  borderLeftColor: color,
  borderTopColor: color,
  borderRightColor: TRANSPARENT,
  borderBottomColor: TRANSPARENT,
  borderImage: 'linear-gradient(to right, #000 50%, transparent 50%) 100% 1',
}));

const CircularProgressBarFilled = ({
  progressPercent,
  fillColor,
  backgroundColor,
  size = 'small',
  label,
  showPercentage = true,
  isMeter,
  variant = 'progress',
  motionEasing,
  pulseMotionDuration,
  pulseMotionDelay,
  fillMotionDuration,
}: CircularProgressBarFilledProps): React.ReactElement => {
  console.log('🚀 ~ backgroundColor:', backgroundColor);
  const hasLabel = label && label.trim()?.length > 0;
  const strokeWidth = circularProgressSizeTokens[size].strokeWidth;
  // Size of the enclosing square
  const sqSize = circularProgressSizeTokens[size].size;

  const animatedOpacity = useSharedValue(pulseAnimation.opacityInitial);
  const animatedProgressPercent = useSharedValue(progressPercent);
  const { theme } = useTheme();
  const fillAndPulseEasing = getIn(theme.motion, motionEasing);
  const pulseDuration =
    castNativeType(makeMotionTime(getIn(theme.motion, pulseMotionDuration))) / 2;

  // Trigger animation for progress fill
  useEffect(() => {
    const fillDuration = castNativeType(makeMotionTime(getIn(theme.motion, fillMotionDuration)));
    animatedProgressPercent.value = withTiming(progressPercent, {
      duration: fillDuration,
      easing: fillAndPulseEasing,
    });
    return () => {
      cancelAnimation(animatedProgressPercent);
    };
  }, [progressPercent, animatedProgressPercent, fillMotionDuration, theme, fillAndPulseEasing]);

  // Trigger pulsating animation
  useEffect(() => {
    const pulsatingAnimationTimingConfig = {
      duration: pulseDuration,
      easing: fillAndPulseEasing,
    };
    if (variant === 'progress') {
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
  }, [animatedOpacity, fillAndPulseEasing, pulseDuration, pulseMotionDelay, theme, variant]);

  const firstIndicatorStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            animatedProgressPercent.value,
            [0, 50],
            [0, 180],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
      opacity: animatedOpacity.value,
    };
  });

  const secondIndicatorStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            animatedProgressPercent.value,
            [0, 100],
            [0, 360],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
      opacity: interpolate(
        animatedProgressPercent.value,
        [0, 49, 50, 100],
        [0, 0, animatedOpacity.value, animatedOpacity.value],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <BaseBox display="flex" width="fit-content" alignItems="center">
      <EmptyCircle size={sqSize} borderWidth={strokeWidth} color={backgroundColor}>
        <Indicator
          style={firstIndicatorStyles}
          size={sqSize}
          borderWidth={strokeWidth}
          color={fillColor}
        />
        <Indicator size={sqSize} borderWidth={strokeWidth} color={backgroundColor} />
        <Indicator
          size={sqSize}
          borderWidth={strokeWidth}
          color={fillColor}
          style={secondIndicatorStyles}
        />

        {showPercentage && size !== 'small' && (
          <BaseBox transform="rotate(45deg)">
            <Text variant="body" weight="regular" size="small">
              {progressPercent}%
            </Text>
          </BaseBox>
        )}
      </EmptyCircle>

      {hasLabel && (
        <Text marginTop="spacing.3" variant="body" weight="regular" size="small">
          {label}
        </Text>
      )}
      {showPercentage && size === 'small' && (
        <Text
          marginTop={hasLabel ? 'spacing.0' : 'spacing.3'}
          variant="body"
          weight="semibold"
          size="small"
        >
          {progressPercent}%
        </Text>
      )}
    </BaseBox>
  );
};

export { CircularProgressBarFilled };
