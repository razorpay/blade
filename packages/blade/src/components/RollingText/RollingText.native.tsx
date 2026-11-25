import React, { useState, useEffect, useRef } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';
import getIn from '~utils/lodashButBetter/get';
import { Text } from '~components/Typography';

type RollingTextProps = {
  texts: string[];
  children?: (text: string) => React.ReactNode;
  onIndexChange?: (index: number) => void;
  cycleDuration?: number;
  showShimmer?: boolean;
};

const RollingText = ({
  texts,
  children,
  onIndexChange,
  cycleDuration: cycleDurationProp,
  showShimmer: _showShimmer,
}: RollingTextProps): React.ReactElement => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const { theme } = useTheme();
  const animDuration = castNativeType(makeMotionTime(getIn(theme.motion, 'duration.moderate')));
  const cycleDuration =
    cycleDurationProp ?? castNativeType(makeMotionTime(getIn(theme.motion, 'delay.xlong')));

  if (__DEV__ && _showShimmer === true) {
    console.warn(
      '[Blade:RollingText] The `showShimmer` prop is not yet supported on React Native and will be ignored.',
    );
  }
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (texts.length <= 1) return undefined;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      opacity.value = withTiming(0, {
        duration: animDuration / 2,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(-12, {
        duration: animDuration / 2,
        easing: Easing.out(Easing.ease),
      });

      timeoutId = setTimeout(() => {
        const next = (currentIndexRef.current + 1) % texts.length;
        currentIndexRef.current = next;
        setCurrentIndex(next);
        onIndexChange?.(next);
        translateY.value = 12;
        opacity.value = 0;
        opacity.value = withTiming(1, {
          duration: animDuration / 2,
          easing: Easing.in(Easing.ease),
        });
        translateY.value = withTiming(0, {
          duration: animDuration / 2,
          easing: Easing.in(Easing.ease),
        });
      }, animDuration / 2);
    }, cycleDuration);

    return () => {
      clearInterval(interval);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [texts.length, animDuration, cycleDuration, opacity, translateY, onIndexChange]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children ? (
        children(texts[currentIndex])
      ) : (
        <Text color="feedback.text.positive.intense" weight="regular" variant="body" size="medium">
          {texts[currentIndex]}
        </Text>
      )}
    </Animated.View>
  );
};

export type { RollingTextProps };
export { RollingText };
