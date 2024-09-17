import React from 'react';
import type { EasingFn } from 'react-native-reanimated';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  Keyframe,
} from 'react-native-reanimated';
import type { ReanimatedKeyframe } from 'react-native-reanimated/lib/typescript/reanimated2/layoutReanimation/animationBuilder/Keyframe';
import { Tag } from './Tag';
import {
  TAG_MAX_WIDTH_END,
  TAG_MAX_WIDTH_START,
  TAG_OPACITY_END,
  TAG_OPACITY_START,
} from './tagAnimationConfig';
import type { AnimatedTagProps } from './types';
import { castNativeType, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';

const useAnimatedTag = (
  onAnimationEndCallback: () => void,
): {
  entering: ReanimatedKeyframe;
  animate: () => void;
  animatedStyle: {
    maxWidth: `${number}%`;
    opacity: number;
  };
} => {
  const maxWidth = useSharedValue(TAG_MAX_WIDTH_START); // Initial max-width value
  const opacity = useSharedValue(TAG_OPACITY_START); // Initial opacity value
  const { theme } = useTheme();

  const entering = new Keyframe({
    0: {
      opacity: TAG_OPACITY_END,
    },
    100: {
      opacity: TAG_OPACITY_START,
      easing: (theme.motion.easing.exit as unknown) as EasingFn,
    },
  }).duration(makeMotionTime(theme.motion.duration.xquick));

  const animate = (): void => {
    maxWidth.value = withTiming(
      TAG_MAX_WIDTH_END,
      {
        duration: makeMotionTime(theme.motion.duration.xquick),
        easing: castNativeType(theme.motion.easing.exit),
      },
      (isComplete) => {
        if (isComplete) {
          runOnJS(onAnimationEndCallback)();
        }
      },
    );
    opacity.value = withTiming(TAG_OPACITY_END, {
      duration: makeMotionTime(theme.motion.duration.xquick),
      easing: Easing.out(Easing.exp),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxWidth: maxWidth.value,
      opacity: opacity.value,
    };
  });

  return { animate, animatedStyle, entering };
};

const AnimatedTag = ({
  children,
  currentTagIndex,
  activeTagIndex,
  onDismiss,
  tagsLength,
  isDisabled,
}: AnimatedTagProps): React.ReactElement => {
  const onAnimationEnd = (): void => {
    onDismiss({ tagIndex: currentTagIndex, tagName: children });
  };

  const prevSelectionsLength = React.useRef<number>();
  const { animate, animatedStyle, entering } = useAnimatedTag(onAnimationEnd);

  const isTagRemoved = prevSelectionsLength.current
    ? prevSelectionsLength.current > tagsLength
    : false;

  return (
    <Animated.View style={animatedStyle} entering={isTagRemoved ? undefined : entering}>
      <Tag
        _isVirtuallyFocused={currentTagIndex === activeTagIndex}
        _isTagInsideInput={true}
        onDismiss={() => {
          animate();
        }}
        marginRight="spacing.3"
        marginY="spacing.2"
        isDisabled={isDisabled}
      >
        {children}
      </Tag>
    </Animated.View>
  );
};

export { AnimatedTag };
