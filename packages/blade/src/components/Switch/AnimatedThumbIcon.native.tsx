import React from 'react';
import type { EasingFunctionFactory } from 'react-native-reanimated';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '~components/BladeProvider';
import type { SvgProps } from '~components/Icons/_Svg/Svg/types';
import Svg from '~components/Icons/_Svg';

const AnimatedThumbIcon = ({
  children,
  isChecked,
  width,
  height,
  viewBox,
  fill,
}: {
  children: React.ReactNode;
  isChecked: boolean;
} & SvgProps): React.ReactElement => {
  const { theme } = useTheme();
  const opacity = useSharedValue(isChecked ? 1 : 0);

  React.useEffect(() => {
    opacity.value = withTiming(isChecked ? 1 : 0, {
      duration: theme.motion.duration.xquick,
      easing: theme.motion.easing.standard.effective as EasingFunctionFactory,
    });
  }, [isChecked, opacity]);

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(opacity.value, [0, 0.2, 1], [0, 0, 1]),
    };
  }, []);

  return (
    <Animated.View style={[opacityStyle]}>
      <Svg width={width} height={height} viewBox={viewBox} fill={fill}>
        {children}
      </Svg>
    </Animated.View>
  );
};

export { AnimatedThumbIcon };
