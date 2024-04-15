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
import { circularProgressSizeTokens } from './progressBarTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import type { TextProps } from '~components/Typography';
import { Text, getTextProps } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';
import { Svg } from '~components/Icons/_Svg';
import getBaseTextStyles from '~components/Typography/BaseText/getBaseTextStyles';

const pulseAnimation = {
  opacityInitial: 1,
  opacityMid: 0.65,
  opacityFinal: 1,
};

const StyledText = styled(SVGText)<Pick<TextProps<{ variant: 'body' }>, 'size' | 'weight'>>(
  ({ theme, size, weight }) => {
    const textProps = getTextProps({ variant: 'body', size, weight });
    console.log('🚀 ~ textProps:', textProps);
    return {
      ...getBaseTextStyles({ theme, ...textProps }),
      strokeWidth: 0,
      fill: getIn(theme.colors, textProps.color!),
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
  variant = 'progress',
  motionEasing,
  pulseMotionDuration,
  pulseMotionDelay,
  fillMotionDuration,
}: CircularProgressBarFilledProps): React.ReactElement => {
  const hasLabel = label && label.trim()?.length > 0;
  const strokeWidth = circularProgressSizeTokens[size].strokeWidth;
  // Size of the enclosing square
  const sqSize = circularProgressSizeTokens[size].size;
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (sqSize - strokeWidth) / 2;
  // Enclose circle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const circumference = 2 * Math.PI * radius;
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const svgProgress = 100 - progressPercent;
  const dashOffset = dashArray - (dashArray * progressPercent) / 100;

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
      strokeDashoffset: animatedStrokeDashoffset.value,
      opacity: animatedOpacity.value,
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
          isMeter={isMeter}
          fill="none"
          stroke={fillColor}
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          // Start progress marker at 12 O'Clock
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
          pulseMotionDuration="duration.2xgentle"
          pulseMotionDelay="delay.long"
          motionEasing="easing.standard.revealing"
          style={firstIndicatorStyles}
        />

        {showPercentage && size !== 'small' && (
          <StyledText
            size={circularProgressSizeTokens[size].percentTextSize}
            weight="semibold"
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".5em"
          >
            {`${progressPercent}%`}
          </StyledText>
        )}
      </Svg>

      {hasLabel && (
        <Text marginTop="spacing.3" variant="body" weight="regular" size="small">
          {label}
        </Text>
      )}
      {showPercentage && size === 'small' && (
        <Text
          marginTop={hasLabel ? 'spacing.0' : 'spacing.3'}
          variant="body"
          size="small"
          weight="semibold"
        >
          {`${progressPercent}%`}
        </Text>
      )}
    </BaseBox>
  );
};

export { CircularProgressBarFilled };
