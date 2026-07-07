import React from 'react';
import type { EasingFactoryFn } from 'react-native-reanimated';
import Animated, {
  withTiming,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';

const Rotate = ({
  children,
  animate,
}: {
  children: React.ReactElement;
  animate?: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();
  const duration = castNativeType(makeMotionTime(getIn(theme.motion, 'duration.gentle')));
  const easing = getIn(theme.motion, 'easing.emphasized') as EasingFactoryFn;

  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  React.useEffect(() => {
    if (animate) {
      rotation.value = withRepeat(
        withTiming(90, { duration, easing }),
        -1,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
    return (): void => {
      cancelAnimation(rotation);
    };
  }, [animate, duration, easing, rotation]);

  if (!animate) {
    return children;
  }

  return <Animated.View style={animatedStyles}>{children}</Animated.View>;
};

export default Rotate;
