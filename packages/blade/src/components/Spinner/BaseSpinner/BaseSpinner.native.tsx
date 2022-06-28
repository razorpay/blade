import React from 'react';
import type { EasingFunctionFactory } from 'react-native-reanimated';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import BaseLoader from './BaseLoader';
import type { BaseSpinnerProps } from './BaseSpinner.d';
import { motion } from './spinnerTokens';

type WithStyle = {
  style: Record<string, unknown>;
};
type AnimatedBaseSpinnerProps = {
  children: React.ReactNode;
} & WithStyle;

const AnimatedBaseSpinner = (props: AnimatedBaseSpinnerProps): React.ReactElement => {
  const { duration, easing } = motion;
  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing: easing as EasingFunctionFactory,
      }),
      -1,
    );
    return (): void => {
      cancelAnimation(rotation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Animated.View {...props} style={[animatedStyles, props.style]} />;
};

const BaseSpinner = ({
  color,
  size,
  ...props
}: BaseSpinnerProps & WithStyle): React.ReactElement => {
  return (
    <AnimatedBaseSpinner {...props}>
      <BaseLoader color={color} size={size} />
    </AnimatedBaseSpinner>
  );
};

export default BaseSpinner;
