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
import type { View } from 'react-native';
import { getPopoverContentWrapperStyles } from './getPopoverContentWrapperStyles';
import type { PopoverContentWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';
import { castNativeType } from '~utils';

const StyledPopoverContentWrapper = styled(BaseBox)<{
  collapse?: boolean;
  styles: CSSProperties;
  isMobile: boolean;
}>(({ theme, isMobile, styles }) => {
  return getPopoverContentWrapperStyles({ theme, styles, isMobile });
});

const PopoverContentWrapper = React.forwardRef<View, PopoverContentWrapperProps>(
  ({ children, styles, side, isVisible, ...props }, ref) => {
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
      opacity.value = withDelay(duration, withTiming(isVisible ? 1 : 0, timings));
      translate.value = withDelay(duration, withTiming(isVisible ? 0 : offset, timings));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    // @ts-expect-error types aren't liking the dynamic object prop `[transform]`
    const animatedStyles = useAnimatedStyle(() => {
      const transform = isHorizontal ? 'translateX' : 'translateY';
      return {
        opacity: opacity.value,
        transform: [{ [transform]: translate.value }],
      };
    }, [isVisible]);

    return (
      <Animated.View style={animatedStyles}>
        <StyledPopoverContentWrapper
          styles={styles}
          // Shadow styles need to be passed directly through native style prop
          // Cannot be done via styled components
          style={castNativeType(theme.elevation.lowRaised)}
          elevation={20}
          ref={ref as never}
          collapse={false}
          isMobile={isMobile}
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
