/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { CSSProperties } from 'react';
import styled from 'styled-components/native';
import type { EasingFn } from 'react-native-reanimated';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import React from 'react';
import type { View } from 'react-native';
import { getPopoverContentWrapperStyles } from './getPopoverContentWrapperStyles';
import type { PopoverContentWrapperProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';
import type { ColorSchemeNames } from '~tokens/theme';
import BaseBox from '~components/Box/BaseBox';

// Animated.createAnimatedComponent(BaseBox) so BaseBox handles elevation prop resolution
// (getElevationValue → shadow styles) while Animated handles opacity on the same View.
// On Android, elevation shadow renders independently of a parent View's opacity —
// co-locating opacity and elevation on the same View fixes the flash.
const AnimatedBaseBox = Animated.createAnimatedComponent(BaseBox as React.FunctionComponent<any>);

const StyledPopoverContentWrapper = styled(AnimatedBaseBox)<{
  collapse?: boolean;
  styles: CSSProperties;
  isMobile: boolean;
  colorScheme: ColorSchemeNames;
}>(({ theme, isMobile, styles, colorScheme }) => {
  return getPopoverContentWrapperStyles({ theme, styles, isMobile, colorScheme });
});

const PopoverContentWrapper = React.forwardRef<View, PopoverContentWrapperProps>(
  ({ children, styles, side, isVisible, colorScheme, ...props }, ref) => {
    const { theme, platform } = useTheme();
    const isMobile = platform === 'onMobile';

    const isOppositeAxis = side === 'right' || side === 'bottom';
    const isHorizontal = side === 'left' || side === 'right';
    const offset = isOppositeAxis ? -size[4] : size[4];

    const translate = useSharedValue(offset);
    const opacity = useSharedValue(0);

    const easing = (theme.motion.easing.entrance as unknown) as EasingFn;
    const duration = theme.motion.duration.quick;

    React.useEffect(() => {
      const timings = { easing, duration };
      opacity.value = withTiming(isVisible ? 1 : 0, timings);
      translate.value = withTiming(isVisible ? 0 : offset, timings);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    // Avoid computed property keys inside useAnimatedStyle — Babel compiles them to
    // _defineProperty() which is not a worklet and crashes Reanimated v4 on the UI thread.
    const translateAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: isHorizontal
          ? [{ translateX: translate.value }]
          : [{ translateY: translate.value }],
      };
    }, [isVisible, isHorizontal]);

    const opacityAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    }, [isVisible]);

    return (
      <Animated.View style={translateAnimatedStyle}>
        <StyledPopoverContentWrapper
          styles={styles}
          style={opacityAnimatedStyle}
          elevation="lowRaised"
          ref={ref as never}
          collapse={false}
          isMobile={isMobile}
          colorScheme={colorScheme}
          // if I don't assert this TS throws error
          // I think because of the intersection type in PopoverContentWrapperProps
          {...(props as any)}
        >
          {children}
        </StyledPopoverContentWrapper>
      </Animated.View>
    );
  },
);

export { PopoverContentWrapper };
