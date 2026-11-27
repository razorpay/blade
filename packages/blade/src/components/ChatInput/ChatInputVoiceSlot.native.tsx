import React from 'react';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';

/**
 * Holds the mic. While Send is hidden, the mic moves over into Send's place at the end of the
 * row, so an empty box has no gap after it. Once there is something to send, it slides back as
 * Send appears. Instant with reduced motion.
 */
const ChatInputVoiceSlot = ({
  shift,
  children,
}: {
  /**
   * How far right to move the mic: Send's width plus the gap while Send is hidden, else 0
   */
  shift: number;
  children: React.ReactElement;
}): React.ReactElement => {
  const { theme } = useTheme();
  const isReducedMotion = useReducedMotion();
  const translateX = useSharedValue(shift);
  const duration = theme.motion.duration.xmoderate;
  const easing = castNativeType(theme.motion.easing.entrance);

  React.useEffect(() => {
    translateX.value = isReducedMotion ? shift : withTiming(shift, { duration, easing });
  }, [shift, isReducedMotion, duration, easing, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export { ChatInputVoiceSlot };
