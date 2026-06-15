import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import type { IndicatorButtonProps } from './types';
import { CAROUSEL_AUTOPLAY_INTERVAL } from '../constants';
import { useTheme } from '~components/BladeProvider';

const DOT_RADIUS = 3;
const RING_GAP = 1;
const RING_STROKE_WIDTH = 2;
const RING_RADIUS = DOT_RADIUS + RING_GAP + RING_STROKE_WIDTH / 2;
const SVG_SIZE = (RING_RADIUS + RING_STROKE_WIDTH / 2) * 2;
const CENTER = SVG_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CircularIndicatorButtonProps = IndicatorButtonProps & {
  isAutoPlaying?: boolean;
};

const CircularIndicatorButton = ({
  onClick,
  isActive,
  variant,
  isAutoPlaying,
  slideIndex,
  ...rest
}: CircularIndicatorButtonProps & Record<string, unknown>): React.ReactElement => {
  const { theme } = useTheme();

  const activeColor = {
    gray: theme.colors.interactive.icon.gray.muted,
    white: theme.colors.interactive.icon.staticWhite.normal,
    blue: theme.colors.interactive.icon.primary.subtle,
  };

  const inactiveColor = theme.colors.overlay.background.moderate;
  const fillColor = isActive ? activeColor[variant] : inactiveColor;
  const showProgressRing = isActive && isAutoPlaying;

  const progress = useSharedValue(CIRCUMFERENCE);

  React.useEffect(() => {
    if (showProgressRing) {
      progress.value = CIRCUMFERENCE;
      progress.value = withTiming(0, {
        duration: CAROUSEL_AUTOPLAY_INTERVAL,
        easing: Easing.linear,
      });
    } else {
      progress.value = CIRCUMFERENCE;
    }
  }, [showProgressRing, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: progress.value,
  }));

  return (
    <Pressable
      onPress={onClick}
      {...rest}
      {...({ slideIndex } as any)}
      style={{
        minWidth: SVG_SIZE,
        minHeight: SVG_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
        <Circle cx={CENTER} cy={CENTER} r={DOT_RADIUS} fill={fillColor} stroke="none" />
        {showProgressRing && (
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke={activeColor[variant]}
            strokeWidth={RING_STROKE_WIDTH}
            strokeDasharray={`${CIRCUMFERENCE}`}
            rotation={-90}
            origin={`${CENTER}, ${CENTER}`}
            animatedProps={animatedProps}
          />
        )}
      </Svg>
    </Pressable>
  );
};

export { CircularIndicatorButton };
export type { CircularIndicatorButtonProps };
