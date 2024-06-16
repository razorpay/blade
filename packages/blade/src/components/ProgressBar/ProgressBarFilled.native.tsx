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
import type { ProgressBarFilledProps } from './types';
import { indeterminateAnimation, pulseAnimation } from './progressBarTokens';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';

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
  type,
  isIndeterminate,
  indeterminateMotionDuration,
}: ProgressBarFilledProps): React.ReactElement => {
  const animatedWidth = useSharedValue(progress); // for progress fill animation
  const animatedOpacity = useSharedValue(pulseAnimation.opacityInitial); // for pulse animation
  const animatedScaleX = useSharedValue(indeterminateAnimation.scaleXInitial); // for indeterminate scale animation
  const animatedLeft = useSharedValue(indeterminateAnimation.leftInitial); // for indeterminate slide animation

  const { theme } = useTheme();
  const fillAndPulseEasing = getIn(theme.motion, motionEasing);
  const pulseDuration =
    castNativeType(makeMotionTime(getIn(theme.motion, pulseMotionDuration))) / 2; // divided by 2 since we animate it with 2 steps in a sequence

  // Trigger animation for progress fill
  useEffect(() => {
    const fillDuration = castNativeType(makeMotionTime(getIn(theme.motion, fillMotionDuration)));
    animatedWidth.value = withTiming(progress, {
      duration: fillDuration,
      easing: fillAndPulseEasing,
    });
    return () => {
      cancelAnimation(animatedWidth);
    };
  }, [progress, animatedWidth, fillMotionDuration, theme, fillAndPulseEasing]);

  // Animated styles for progress fill animation
  const progressFillAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
    };
  });

  // Trigger animation for indeterminate progress bar
  useEffect(() => {
    if (type === 'progress' && isIndeterminate) {
      const indeterminateDuration = castNativeType(
        makeMotionTime(getIn(theme.motion, indeterminateMotionDuration)),
      );
      const indeterminateEasing = Easing.linear;

      // Sliding animation
      animatedLeft.value = withRepeat(
        withTiming(indeterminateAnimation.leftFinal, {
          duration: indeterminateDuration,
          easing: indeterminateEasing,
        }),
        -1,
      );

      // Scaling animation
      animatedScaleX.value = withRepeat(
        withSequence(
          withTiming(indeterminateAnimation.scaleXMid, {
            duration: indeterminateDuration / 2, // divided by 2 since we animate it with 2 steps in a sequence
            easing: indeterminateEasing,
          }),
          withTiming(indeterminateAnimation.scaleXFinal, {
            duration: indeterminateDuration / 2, // divided by 2 since we animate it with 2 steps in a sequence
            easing: indeterminateEasing,
          }),
        ),
        -1,
      );
    }

    return () => {
      cancelAnimation(animatedLeft);
      cancelAnimation(animatedScaleX);
    };
  }, [animatedLeft, animatedScaleX, indeterminateMotionDuration, isIndeterminate, theme, type]);

  // Animated styles for indeterminate animation
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error TS errors originating from reanimated. Should be fixed in future versions. Ref: https://github.com/software-mansion/react-native-reanimated/issues/4840
  const indeterminateAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: animatedLeft.value,
      transform: [{ scaleX: animatedScaleX.value }],
    };
  });

  //Trigger pulsating animation
  useEffect(() => {
    const pulsatingAnimationTimingConfig = {
      duration: pulseDuration,
      easing: fillAndPulseEasing,
    };
    if (type === 'progress') {
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
  }, [animatedOpacity, fillAndPulseEasing, pulseDuration, pulseMotionDelay, theme, type]);

  // Animated styles for pulse animation
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

export type { ProgressBarFilledProps };
export { ProgressBarFilled };
