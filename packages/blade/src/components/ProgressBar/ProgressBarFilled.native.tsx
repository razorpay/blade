import React, { useEffect } from 'react';
import styled from 'styled-components';
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
import { useTheme } from '../BladeProvider';
import type { ProgressBarFilledProps } from './types';
import { indeterminateAnimation, pulseAnimation } from './progressBarTokens';
import { castNativeType, getIn, makeMotionTime } from '~utils';

const ProgressBarIndeterminateFilledContainer = styled(Animated.View)<
  Pick<ProgressBarFilledProps, 'backgroundColor' | 'progress'>
>(({ backgroundColor }) => ({
  backgroundColor,
  height: '100%',
  width: indeterminateAnimation.fillWidth,
  position: 'absolute',
}));

const ProgressBarDeterminateFilledContainer = styled(Animated.View)<
  Pick<ProgressBarFilledProps, 'backgroundColor' | 'progress'>
>(({ backgroundColor, progress }) => ({
  backgroundColor,
  height: '100%',
  width: `${progress}%`,
}));

const ProgressBarPulseAnimation = styled(Animated.View)({
  backgroundColor: pulseAnimation.backgroundColor,
  opacity: pulseAnimation.opacityInitial,
  width: '100%',
  height: '100%',
});

const ProgressBarFilled = ({
  backgroundColor,
  progress,
  fillMotionDuration,
  motionEasing,
  pulseMotionDuration,
  pulseMotionDelay,
  variant,
  isIndeterminate,
  indeterminateMotionDuration,
}: ProgressBarFilledProps): React.ReactElement => {
  const animatedWidth = useSharedValue(progress); // for progress fill animation
  const animatedOpacity = useSharedValue(pulseAnimation.opacityInitial); // for pulse animation
  const animatedScaleX = useSharedValue(indeterminateAnimation.scaleXInitial); // for indeterminate scale animation
  const animatedLeft = useSharedValue(indeterminateAnimation.leftInitial); // for indeterminate slide animation

  const { theme } = useTheme();
  const easing = getIn(theme.motion, motionEasing);
  const pulseDuration =
    castNativeType(makeMotionTime(getIn(theme.motion, pulseMotionDuration))) / 2; // divided by 2 since we animate it with 2 steps in a sequence

  useEffect(() => {
    const indeterminateDuration = castNativeType(
      makeMotionTime(getIn(theme.motion, indeterminateMotionDuration)),
    );

    const slideAndScaleAnimationTimingConfig = {
      duration: indeterminateDuration,
      easing: Easing.linear,
    };

    if (variant === 'progress') {
      animatedLeft.value = withRepeat(
        withTiming(indeterminateAnimation.leftFinal, slideAndScaleAnimationTimingConfig),
        -1,
      );
      animatedScaleX.value = withRepeat(
        withSequence(
          withTiming(indeterminateAnimation.scaleXMid, {
            duration: slideAndScaleAnimationTimingConfig.duration / 2, // divided by 2 since we animate it with 2 steps in a sequence
            easing: slideAndScaleAnimationTimingConfig.easing,
          }),
          withTiming(indeterminateAnimation.scaleXFinal, {
            duration: slideAndScaleAnimationTimingConfig.duration / 2, // divided by 2 since we animate it with 2 steps in a sequence
            easing: slideAndScaleAnimationTimingConfig.easing,
          }),
        ),
        -1,
      );
    }

    return () => {
      cancelAnimation(animatedLeft);
    };
  }, [
    animatedLeft,
    animatedScaleX,
    easing,
    indeterminateMotionDuration,
    pulseDuration,
    pulseMotionDelay,
    theme.motion,
    variant,
  ]);

  useEffect(() => {
    const pulsatingAnimationTimingConfig = {
      duration: pulseDuration,
      easing,
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
  }, [animatedOpacity, easing, pulseDuration, pulseMotionDelay, theme.motion, variant]);

  useEffect(() => {
    const fillDuration = castNativeType(makeMotionTime(getIn(theme.motion, fillMotionDuration)));
    animatedWidth.value = withTiming(progress, {
      duration: fillDuration,
      easing,
    });
    return () => {
      cancelAnimation(animatedWidth);
    };
  }, [progress, animatedWidth, fillMotionDuration, motionEasing, theme.motion, easing]);

  const progressFillAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
    };
  });

  const indeterminateAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: animatedLeft.value,
      transform: [{ scaleX: animatedScaleX.value }],
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    };
  });

  const ProgressBarFilledContainer = isIndeterminate
    ? ProgressBarIndeterminateFilledContainer
    : ProgressBarDeterminateFilledContainer;

  return (
    <ProgressBarFilledContainer
      style={isIndeterminate ? indeterminateAnimatedStyle : progressFillAnimatedStyle}
      backgroundColor={backgroundColor}
      progress={progress}
    >
      <ProgressBarPulseAnimation style={pulseAnimatedStyle} />
    </ProgressBarFilledContainer>
  );
};

export { ProgressBarFilled, ProgressBarFilledProps };
