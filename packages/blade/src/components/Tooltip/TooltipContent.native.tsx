import type { CSSProperties } from 'react';
import React from 'react';
import type { EasingFn } from 'react-native-reanimated';
import Animated, {
  withDelay,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { Side } from '@floating-ui/react';
import { TooltipContentWrapper } from './TooltipContextWrapper';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';

type TooltipContentProps = {
  children: React.ReactNode;
  style: CSSProperties;
  arrow: React.ReactNode;
  isVisible: boolean;
  side: Side;
};

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, arrow, side, style, isVisible }, ref) => {
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
        <TooltipContentWrapper
          position="absolute"
          paddingTop="spacing.3"
          paddingBottom="spacing.3"
          paddingLeft="spacing.4"
          paddingRight="spacing.4"
          maxWidth={{ base: '120px', l: '160px' }}
          ref={ref as never}
          styles={style}
          collapsable={false}
        >
          <Text
            variant="body"
            size="small"
            weight="regular"
            contrast="high"
            color="feedback.text.neutral.highContrast"
          >
            {children}
          </Text>
          {arrow}
        </TooltipContentWrapper>
      </Animated.View>
    );
  },
);

export { TooltipContent };
