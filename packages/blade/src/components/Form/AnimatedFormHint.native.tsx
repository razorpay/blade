import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { formHintMotion } from './formTokens';
import { useTheme } from '~components/BladeProvider';
import { castNativeType, makeMotionTime } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import type { EasingFactoryFn } from '~tokens/global';

type AnimatedFormHintProps = {
  /**
   * Whether the hint is revealed. Drives the enter / exit transition.
   */
  isVisible: boolean;
  children: ReactNode;
};

/**
 * Eases the form hint's entry and exit instead of mounting it instantly, so
 * content below slides rather than jumping.
 *
 * Reanimated can't animate to an intrinsic height, so the inner view is measured
 * via `onLayout` and the outer view animates between `0` and that measured height.
 *
 * `maxHeight` rather than `height` does the clipping deliberately: it caps the
 * container without constraining the child, so the child keeps laying out at its
 * natural height and `onLayout` keeps reporting a usable measurement even while
 * fully collapsed.
 *
 * The children stay mounted while collapsed so the id the input's
 * `accessibilityDescribedBy` points at remains resolvable.
 */
const AnimatedFormHint = ({ isVisible, children }: AnimatedFormHintProps): ReactElement => {
  const { theme } = useTheme();
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);
  const maxHeight = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(isVisible ? 1 : 0);
  /**
   * The first height to resolve is snapped to rather than animated, otherwise
   * every hint plays its entry transition as soon as it is measured.
   */
  const hasSettled = React.useRef(false);
  const defaultIsVisible = React.useRef(isVisible).current;
  const isMeasured = contentHeight !== null;

  const phase = isVisible ? 'enter' : 'exit';
  const motionConfig: { duration: number; easing: EasingFactoryFn } = {
    duration: castNativeType(
      makeMotionTime(getIn(theme.motion.duration, formHintMotion[phase].duration)),
    ),
    easing: castNativeType(theme.motion.easing[formHintMotion[phase].easing]),
  };

  React.useEffect(() => {
    if (contentHeight === null) {
      return;
    }

    const targetMaxHeight = isVisible ? contentHeight : 0;
    const targetOpacity = isVisible ? 1 : 0;

    if (!hasSettled.current) {
      hasSettled.current = true;
      maxHeight.value = targetMaxHeight;
      opacity.value = targetOpacity;
      return;
    }

    maxHeight.value = withTiming(targetMaxHeight, motionConfig);
    opacity.value = withTiming(targetOpacity, motionConfig);
    // motionConfig is derived from isVisible, tracking it separately would double-fire
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, contentHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: maxHeight.value,
    opacity: opacity.value,
  }));

  /**
   * Until the first measurement lands there is no pixel value to animate between,
   * so the hint is held at rest in whichever state it mounted in.
   */
  const staticStyle = {
    maxHeight: defaultIsVisible ? undefined : 0,
    opacity: defaultIsVisible ? 1 : 0,
  };

  const handleLayout = (event: LayoutChangeEvent): void => {
    const measuredHeight = event.nativeEvent.layout.height;

    if (measuredHeight > 0 && measuredHeight !== contentHeight) {
      setContentHeight(measuredHeight);
    }
  };

  return (
    <Animated.View style={[{ overflow: 'hidden' }, isMeasured ? animatedStyle : staticStyle]}>
      <View onLayout={handleLayout}>{children}</View>
    </Animated.View>
  );
};

export { AnimatedFormHint };
export type { AnimatedFormHintProps };
