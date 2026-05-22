/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { CSSProperties } from 'react';
import styled from 'styled-components/native';
import type { EasingFn } from 'react-native-reanimated';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import { getTooltipContentWrapperStyles } from './getTooltipContentWrapperStyles';
import type { TooltipContentWrapperProps } from './types';
import type { ColorSchemeNames } from '~tokens/theme/theme';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';
import { castNativeType } from '~utils';

const StyledTooltipContentWrapper = styled(BaseBox)<{
  collapse?: boolean;
  styles: CSSProperties;
  colorScheme?: ColorSchemeNames;
}>(({ theme, styles, colorScheme = 'light' }) => {
  return getTooltipContentWrapperStyles({ theme, styles, colorScheme });
});

const TooltipContentWrapper = React.forwardRef<View, TooltipContentWrapperProps>(
  ({ children, styles, side, isVisible, ...props }, ref) => {
    const { theme } = useTheme();

    const isOppositeAxis = side === 'right' || side === 'bottom';
    const isHorizontal = side === 'left' || side === 'right';
    const offset = isOppositeAxis ? -size[4] : size[4];

    const translate = useSharedValue(offset);
    const opacity = useSharedValue(0);

    const easing = (theme.motion.easing.entrance as unknown) as EasingFn;
    const duration = theme.motion.duration.quick;

    React.useEffect(() => {
      const timings = { easing, duration };
      opacity.value = withDelay(duration, withTiming(isVisible ? 1 : 0, timings));
      translate.value = withDelay(duration, withTiming(isVisible ? 0 : offset, timings));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    // Avoid computed property keys inside useAnimatedStyle — Babel compiles them to
    // _defineProperty() which is not a worklet and crashes Reanimated v4 on the UI thread.
    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: isHorizontal
          ? [{ translateX: translate.value }]
          : [{ translateY: translate.value }],
      };
    }, [isVisible]);

    // RN doesn't support backdropFilter: blur(). The tooltip background
    // (popup.background.gray.intense) is semi-transparent — on web the blur makes it
    // appear solid, but on native content bleeds through. We render an opaque sibling
    // View behind the tooltip at the same position/size measured via onLayout.
    // The measurement happens while opacity is still 0 (entry animation), so no flash.
    const [layout, setLayout] = React.useState<{
      x: number;
      y: number;
      width: number;
      height: number;
    } | null>(null);

    const handleLayout = React.useCallback((e: LayoutChangeEvent) => {
      const { x, y, width, height } = e.nativeEvent.layout;
      setLayout((prev) => {
        if (
          prev &&
          prev.x === x &&
          prev.y === y &&
          prev.width === width &&
          prev.height === height
        ) {
          return prev;
        }
        return { x, y, width, height };
      });
    }, []);

    return (
      <Animated.View style={animatedStyles}>
        {layout && (
          <View
            style={{
              position: 'absolute',
              left: layout.x,
              top: layout.y,
              width: layout.width,
              height: layout.height,
              backgroundColor: theme.colors.surface.background.gray.intense,
              borderRadius: theme.border.radius.medium,
            }}
          />
        )}
        <StyledTooltipContentWrapper
          styles={styles}
          // Shadow styles need to be passed directly through native style prop
          // Cannot be done via styled components
          style={castNativeType(theme.elevation.lowRaised)}
          elevation={20}
          ref={ref as never}
          collapse={false}
          onLayout={handleLayout}
          // if I don't assert this TS throws error
          // I think because of the intersection type in TooltipContentWrapperProps
          {...(props as any)}
        >
          {children}
        </StyledTooltipContentWrapper>
      </Animated.View>
    );
  },
);

export { TooltipContentWrapper };
