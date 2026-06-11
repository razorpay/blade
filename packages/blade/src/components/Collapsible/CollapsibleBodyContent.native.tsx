import type { ReactElement } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
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

const CollapsibleBodyContent = ({
  children,
  _hasMargin,
}: CollapsibleBodyContentProps): ReactElement => {
  const { isExpanded, direction } = useCollapsible();
  const { theme } = useTheme();

  const opacity = useSharedValue(getOpacity({ isExpanded }));

  // `undefined` implies no height restrictions which is analogous to `auto` on web
  const height = useSharedValue(isExpanded ? undefined : 0);
  const layoutHeightRef = useRef(0);

  // Dual tracking is intentional: isAnimating (state) triggers re-renders so the absolute↔relative
  // position switch in the render path is reactive; isAnimatingRef (ref) gives synchronous reads
  // in onLayout/onAnimationComplete callbacks where stale closure state would be unreliable.
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const animationIdRef = useRef(0);
  const onAnimationComplete = useCallback((id: number): void => {
    requestAnimationFrame(() => {
      if (animationIdRef.current === id) {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }
    });
  }, []);

  const duration = castNativeType(getTransitionDuration(theme));
  const easing = castNativeType(getTransitionEasing(theme));

  useEffect(() => {
    const currentId = ++animationIdRef.current;
    isAnimatingRef.current = true;
    setIsAnimating(true);

    opacity.value = withTiming(getOpacity({ isExpanded }), { duration, easing });
    height.value = withTiming(
      isExpanded && layoutHeightRef.current ? layoutHeightRef.current : 0,
      { duration, easing },
      (isComplete) => {
        if (isComplete) {
          runOnJS(onAnimationComplete)(currentId);
        }
      },
    );
  }, [isExpanded, opacity, duration, easing, height, onAnimationComplete]);

  const animatedStyles = useAnimatedStyle(
    (): ViewStyle => {
      return {
        opacity: opacity.value,
        height: height.value,
      };
    },
  );

  /**
   * Tracks the height of content so we can animate height to and from 0 to the content's height.
   * **Note:** We can't animate height from 0 to auto or vice-versa.
   */
  const onLayout: (event: LayoutChangeEvent) => void = useCallback(
    (event) => {
      const newHeight = event.nativeEvent.layout.height;
      if (isAnimatingRef.current) {
        if (newHeight > layoutHeightRef.current) {
          layoutHeightRef.current = newHeight;
          height.value = withTiming(newHeight, { duration, easing });
        }
      } else if (newHeight !== layoutHeightRef.current) {
        layoutHeightRef.current = newHeight;
      }
    },
    [height, duration, easing],
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
        <Box {...getCollapsibleBodyContentBoxProps({ direction, _hasMargin })}>{children}</Box>
      </View>
    </AnimatedStyledCollapsibleBodyContent>
  );
};

export { CollapsibleBodyContent };
