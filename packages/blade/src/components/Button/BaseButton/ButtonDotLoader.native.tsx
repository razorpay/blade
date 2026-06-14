import React from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

type ButtonDotLoaderProps = {
  size: number;
  color: string;
};

const Dot = ({
  dotSize,
  color,
  delay,
}: {
  dotSize: number;
  color: string;
  delay: number;
}): React.ReactElement => {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    const offset = dotSize * 0.5;
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-offset, { duration: 200, easing: Easing.out(Easing.ease) }),
          withTiming(offset, { duration: 200, easing: Easing.in(Easing.ease) }),
          withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) }),
        ),
        -1,
      ),
    );
    return () => {
      cancelAnimation(translateY);
    };
  }, [translateY, dotSize, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

const ButtonDotLoader = ({ size, color }: ButtonDotLoaderProps): React.ReactElement => {
  const dotSize = size / 2;
  const gap = (size * 2 - dotSize * 3) / 2;

  return (
    <View
      style={{
        width: size * 2,
        height: size,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
      }}
    >
      <Dot dotSize={dotSize} color={color} delay={0} />
      <Dot dotSize={dotSize} color={color} delay={200} />
      <Dot dotSize={dotSize} color={color} delay={400} />
    </View>
  );
};

export { ButtonDotLoader };
export type { ButtonDotLoaderProps };
