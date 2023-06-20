import type { ReactElement } from 'react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import type { CollapsibleBodyContentProps } from './types';
import { useCollapsible } from './CollapsibleContext';
import {
  getCollapsibleBodyContentBoxProps,
  getOpacity,
  getTransitionDuration,
  getTransitionEasing,
} from './commonStyles';
import { nativeStyles } from './styles.native';
import { Box } from '~components/Box';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';

type AnimatedStyledCollapsibleBodyContentProps = {
  isExpanded: boolean;
};

const AnimatedStyledCollapsibleBodyContent = styled(
  Animated.View,
)<AnimatedStyledCollapsibleBodyContentProps>(() => {
  return {
    overflow: 'hidden',
  };
});

const CollapsibleBodyContent = ({ children }: CollapsibleBodyContentProps): ReactElement => {
  const { isExpanded, defaultIsExpanded, direction } = useCollapsible();
  const { theme } = useTheme();

  const opacity = useSharedValue(getOpacity({ isExpanded }));
  const height = useSharedValue(isExpanded ? undefined : 0);
  const [layoutHeight, setLayoutHeight] = useState(0);

  // Keeps track of running animation to control absolute / relative positioning
  const [isAnimating, setIsAnimating] = useState(false);
  const onAnimationComplete = useCallback((): void => setIsAnimating(false), []);

  const duration = castNativeType(getTransitionDuration(theme));
  const easing = castNativeType(getTransitionEasing(theme));

  useEffect(() => {
    setIsAnimating(true);

    opacity.value = withTiming(getOpacity({ isExpanded }), { duration, easing });
    height.value = withTiming(
      // Animates the height to the measured value
      isExpanded && layoutHeight ? layoutHeight : 0,
      { duration, easing },
      (isComplete) => {
        // Only run this if the animation ran uninterrupted, for eg collapsing the content before it expanded fully
        if (isComplete) {
          // The callback `onAnimationComplete` has to be declared outside this, on JS thread
          runOnJS(onAnimationComplete)();
        }
      },
    );
  }, [isExpanded, opacity, duration, easing, height, layoutHeight, onAnimationComplete]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      height: height.value,
    };
  });

  /**
   * Tracks the height of content so we can animate height to and from 0 to the content's height.
   * **Note:** We can't animate height from 0 to auto or vice-versa.
   */
  const onLayout: (event: LayoutChangeEvent) => void = useCallback(
    (event) => {
      if (event.nativeEvent.layout.height > layoutHeight) {
        /**
         * We set `layoutHeight` if the native event's layout height is larger.
         *
         * The greater than comparison is needed because sometimes the native event's layout height is smaller than actual content height 🤯
         * For example, this happens if you try to render a lengthy `Text` that wraps onto multiple lines.
         * In this case the initial native event's layout height only counts height of `Text` as if it were single line.
         * So, when the `Text` actually renders on screen and wraps, another `nativeEvent` is triggered which gives us the actual content height.
         * `nativeEvent` is triggered multiple times during animation but we only set `layoutHeight` if the height value is greater, hence the check.
         */
        setLayoutHeight(event.nativeEvent.layout.height);
      }
    },
    [layoutHeight],
  );

  return (
    <AnimatedStyledCollapsibleBodyContent isExpanded={isExpanded} style={animatedStyles}>
      <View
        onLayout={onLayout}
        /**
         * This View is positioned absolute in collapsed state so `onLayout` can capture the height of the content.
         * During animation, it's positioned relative so height related animation can happen, pushing adjacent content down or up.
         */
        style={
          isExpanded || isAnimating
            ? nativeStyles.collapsibleBodyExpanded
            : nativeStyles.collapsibleBodyCollapsed
        }
      >
        <Box {...getCollapsibleBodyContentBoxProps({ direction })}>{children}</Box>
      </View>
    </AnimatedStyledCollapsibleBodyContent>
  );
};

export { CollapsibleBodyContent };
