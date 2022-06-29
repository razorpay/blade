import React from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { EasingFunctionFactory } from '../../../tokens/global/motion';
import getIn from '../../../utils/getIn';
import { useTheme } from '../../BladeProvider';
import BaseLoader from './Loader';
import type { SpinnerProps } from './Spinner';
import { getSpinnerSize, motion } from './spinnerTokens';

type WithStyle = {
  style: Record<string, unknown>;
};
type AnimatedSpinnerProps = {
  children: React.ReactNode;
} & WithStyle;

const AnimatedSpinner = (props: AnimatedSpinnerProps): React.ReactElement => {
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

const Spinner = ({ color, size, ...props }: SpinnerProps & WithStyle): React.ReactElement => {
  const { theme } = useTheme();
  const spinnerSize = getSpinnerSize(size);
  const spinnerColor = getIn(theme.colors, color);

  return (
    <AnimatedSpinner {...props}>
      <BaseLoader color={spinnerColor} size={spinnerSize} />
    </AnimatedSpinner>
  );
};

export default Spinner;
