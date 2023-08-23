import React from 'react';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { Tag } from './Tag';
import {
  TAG_MAX_WIDTH_END,
  TAG_MAX_WIDTH_START,
  TAG_OPACITY_END,
  TAG_OPACITY_START,
} from './tagAnimationConfig';
import type { AnimatedTagProps } from './types';
import { castNativeType, useTheme } from '~utils';

const useAnimatedTag = (
  onAnimationEndCallback: () => void,
): {
  animate: () => void;
  animatedStyle: {
    maxWidth: number;
    opacity: number;
  };
} => {
  const maxWidth = useSharedValue(TAG_MAX_WIDTH_START); // Initial max-width value
  const opacity = useSharedValue(TAG_OPACITY_START); // Initial opacity value
  const { theme } = useTheme();

  const animate = (): void => {
    maxWidth.value = withTiming(
      TAG_MAX_WIDTH_END,
      {
        duration: theme.motion.duration.xquick,
        easing: castNativeType(theme.motion.easing.exit.effective),
      },
      (isComplete) => {
        if (isComplete) {
          runOnJS(onAnimationEndCallback)();
        }
      },
    );
    opacity.value = withTiming(TAG_OPACITY_END, {
      duration: theme.motion.duration.xquick,
      easing: Easing.out(Easing.exp),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxWidth: maxWidth.value,
      opacity: opacity.value,
    };
  });

  return { animate, animatedStyle };
};

const AnimatedTag = ({
  children,
  currentTagIndex,
  activeTagIndex,
  onDismiss,
}: AnimatedTagProps): React.ReactElement => {
  const onAnimationEnd = (): void => {
    onDismiss({ tagIndex: currentTagIndex, tagName: children });
  };

  const { animate, animatedStyle } = useAnimatedTag(onAnimationEnd);

  return (
    <Animated.View style={animatedStyle}>
      <Tag
        _isVirtuallyFocussed={currentTagIndex === activeTagIndex}
        _isTagInsideInput={true}
        onDismiss={() => {
          animate();
        }}
        marginRight="spacing.3"
        marginY="spacing.2"
      >
        {children}
      </Tag>
    </Animated.View>
  );
};

export { AnimatedTag };
