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
import type { Side } from '@floating-ui/react';
import { getTooltipContentWrapperStyles } from './getTooltipContentWrapperStyles';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';
import type { BoxProps } from '~components/Box';

const StyledTooltipContentWrapper = styled(BaseBox)<{ collapse?: boolean; styles: CSSProperties }>(
  ({ theme, styles }) => {
    return getTooltipContentWrapperStyles({ theme, styles });
  },
);

type TooltipContentWrapperProps = {
  styles: CSSProperties;
  side?: Side;
  isVisible?: boolean;
} & BaseBoxProps;

const TooltipContentWrapper = React.forwardRef<HTMLDivElement, TooltipContentWrapperProps>(
  ({ children, styles, side, isVisible, ...props }, ref) => {
    const { theme } = useTheme();

    const isCrossAxis = side === 'right' || side === 'bottom';
    const isHorizontal = side === 'left' || side === 'right';
    const offset = isCrossAxis ? -size[4] : size[4];

    const translate = useSharedValue(offset);
    const opacity = useSharedValue(0);

    const easing = (theme.motion.easing.entrance.effective as unknown) as EasingFn;
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
        <StyledTooltipContentWrapper
          styles={styles}
          ref={ref as never}
          collapse={false}
          // if I don't assert this TS throws error
          // I think because of the intersection type in TooltipContentWrapperProps
          {...(props as BoxProps)}
        >
          {children}
        </StyledTooltipContentWrapper>
      </Animated.View>
    );
  },
);

export { TooltipContentWrapper };
