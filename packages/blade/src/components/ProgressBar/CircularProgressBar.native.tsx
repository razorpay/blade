import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { Animated as RNAnimated } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { CircularProgressBarFilledProps } from './types';
import { pulseAnimation, circularProgressSizeTokens } from './progressBarTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';

// The actual transparent color is '#00000000', but it is not working in android so using '#00000001' as a workaround
// Related Issue - https://github.com/facebook/react-native/issues/34722
const TRANSPARENT = '#00000001';

const BaseCircle = styled(RNAnimated.View)<{ size: number; borderWidth?: number }>(
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
}));

const CoverIndicator = styled(BaseCircle)<{ color: string }>(({ color }) => ({
  position: 'absolute',
  borderLeftColor: color,
  borderTopColor: color,
  borderRightColor: TRANSPARENT,
  borderBottomColor: TRANSPARENT,
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
}: CircularProgressBarFilledProps): React.ReactElement => {
  const hasLabel = label && label.trim()?.length > 0;
  const animatedProgress = useRef(new RNAnimated.Value(0)).current;
  const strokeWidth = circularProgressSizeTokens[size].strokeWidth;
  // Size of the enclosing square
  const sqSize = circularProgressSizeTokens[size].size;

  const animateProgress = useRef((toValue) => {
    RNAnimated.spring(animatedProgress, {
      toValue,
      useNativeDriver: true,
    }).start();
  }).current;

  useEffect(() => {
    animateProgress(progressPercent);
  }, [animateProgress, progressPercent]);

  const animatedOpacity = useSharedValue(pulseAnimation.opacityInitial);
  const { theme } = useTheme();
  const fillAndPulseEasing = getIn(theme.motion, motionEasing);
  const pulseDuration =
    castNativeType(makeMotionTime(getIn(theme.motion, pulseMotionDuration))) / 2;

  //Trigger pulsating animation
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

  // Animated styles for pulse animation
  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    };
  });

  const firstIndicatorRotate = animatedProgress.interpolate({
    inputRange: [0, 50],
    outputRange: ['0deg', '180deg'],
    extrapolate: 'clamp',
  });

  const secondIndicatorRotate = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'clamp',
  });

  const secondIndictorVisibility = animatedProgress.interpolate({
    inputRange: [0, 49, 50, 100],
    outputRange: [0, 0, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <BaseBox display="flex" width="fit-content" alignItems="center">
      <EmptyCircle size={sqSize} borderWidth={strokeWidth} color={backgroundColor}>
        <Indicator
          style={{ transform: [{ rotate: firstIndicatorRotate }] }}
          size={sqSize}
          borderWidth={strokeWidth}
          color={fillColor}
        />
        <Indicator size={sqSize} borderWidth={strokeWidth} color="aqua" />
        <Indicator
          size={sqSize}
          borderWidth={strokeWidth}
          color={fillColor}
          style={{
            transform: [{ rotate: secondIndicatorRotate }],
            opacity: secondIndictorVisibility,
          }}
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
