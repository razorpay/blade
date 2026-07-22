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
  useReducedMotion,
} from 'react-native-reanimated';

type ButtonDotLoaderProps = {
  size: number;
  color: string;
} & Pick<
  React.ComponentProps<typeof View>,
  'accessibilityLabel' | 'accessibilityRole' | 'accessibilityState' | 'accessibilityHint' | 'testID'
>;

const Dot = ({
  dotSize,
  color,
  delay,
  reduceMotion,
}: {
  dotSize: number;
  color: string;
  delay: number;
  reduceMotion: boolean;
}): React.ReactElement => {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (reduceMotion) {
      translateY.value = 0;
      return () => {
        cancelAnimation(translateY);
      };
    }
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
  }, [translateY, dotSize, delay, reduceMotion]);

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

const ButtonDotLoader = ({ size, color, ...rest }: ButtonDotLoaderProps): React.ReactElement => {
  const dotSize = size / 2;
  const gap = (size * 2 - dotSize * 3) / 2;
  const reduceMotion = useReducedMotion();

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
      {...rest}
    >
      <Dot dotSize={dotSize} color={color} delay={0} reduceMotion={reduceMotion} />
      <Dot dotSize={dotSize} color={color} delay={200} reduceMotion={reduceMotion} />
      <Dot dotSize={dotSize} color={color} delay={400} reduceMotion={reduceMotion} />
    </View>
  );
};

export { ButtonDotLoader };
export type { ButtonDotLoaderProps };
