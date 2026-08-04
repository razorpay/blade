/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import type { SpotlightPopoverTourMaskRect } from './types';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { componentZIndices } from '~utils/componentZIndices';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

/**
 * Four-rect overlays leave a sharp rectangular hole. The pulse border (and web mask hole)
 * use rounded corners — without these wedges, white UI shows through at each corner.
 * Radius matches web TourMask hole (`rx={borderRadius}`) so cutout aligns with the pulse stroke.
 */
const getCornerWedgePaths = (
  x: number,
  y: number,
  width: number,
  height: number,
  r: number,
): [string, string, string, string] => {
  const right = x + width;
  const bottom = y + height;
  return [
    // top-left: sharp corner square minus quarter-circle of the rounded hole
    `M ${x} ${y} H ${x + r} A ${r} ${r} 0 0 0 ${x} ${y + r} Z`,
    // top-right
    `M ${right} ${y} V ${y + r} A ${r} ${r} 0 0 0 ${right - r} ${y} Z`,
    // bottom-right
    `M ${right} ${bottom} H ${right - r} A ${r} ${r} 0 0 0 ${right} ${bottom - r} Z`,
    // bottom-left
    `M ${x} ${bottom} V ${bottom - r} A ${r} ${r} 0 0 0 ${x + r} ${bottom} Z`,
  ];
};

type SpotlightPopoverTourMaskProps = {
  padding: number;
  size: SpotlightPopoverTourMaskRect;
  isTransitioning: boolean;
};

const absoluteFill = {
  ...StyleSheet.absoluteFillObject,
  // Keep below TourPopover host (zIndex: componentZIndices.popover = 1100). Dim rects use
  // pointerEvents="auto" outside the cutout — if mask zIndex ≥ popover host, Next/Prev/Done
  // taps never reach the footer.
  zIndex: componentZIndices.tourMask - 1,
} as const;

type MaskGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderWidth: number;
  borderRadius: number;
  isSizeZero: boolean;
};

const useMaskGeometry = (size: SpotlightPopoverTourMaskRect, padding: number): MaskGeometry => {
  const { theme } = useTheme();
  const width = size.width + padding;
  const height = size.height + padding;
  const x = size.x - (width - size.width) / 2;
  const y = size.y - (height - size.height) / 2;
  const borderWidth = theme.spacing[1];
  const borderRadius = theme.spacing[2];
  const isSizeZero = size.width === 0 || size.height === 0;

  return { x, y, width, height, borderWidth, borderRadius, isSizeZero };
};

const useWindowSize = (): { width: number; height: number } => {
  const [windowSize, setWindowSize] = React.useState(() => {
    const window = Dimensions.get('window');
    const screen = Dimensions.get('screen');
    return {
      width: window.width || screen.width,
      height: window.height || screen.height,
    };
  });

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setWindowSize({
        width: window.width || screen.width,
        height: window.height || screen.height,
      });
    });
    return () => subscription.remove();
  }, []);

  return windowSize;
};

const useMaskAnimations = (
  isTransitioning: boolean,
  isSizeZero: boolean,
): {
  holeCoverAnimatedProps: ReturnType<typeof useAnimatedProps>;
  pulseAnimatedProps: ReturnType<typeof useAnimatedProps>;
} => {
  const { theme } = useTheme();
  const duration = theme.motion.duration.gentle;
  const entranceEasing = theme.motion.easing.entrance;
  const exitEasing = theme.motion.easing.exit;

  // While measuring (size zero), keep overlay fully visible so open tour isn't blank
  const fadeOpacity = useSharedValue(isSizeZero ? 1 : 0);
  const pulseOpacity = useSharedValue(0.5);

  React.useEffect(() => {
    // Size-zero / measuring: stay fully dimmed. Otherwise hide cutout only while transitioning.
    const show = isSizeZero || !isTransitioning;
    fadeOpacity.value = withTiming(show ? 1 : 0, {
      duration: isSizeZero ? 0 : duration,
      // @ts-ignore reanimated accepts EasingFactoryFn from theme tokens
      easing: show ? entranceEasing : exitEasing,
    });
  }, [duration, entranceEasing, exitEasing, fadeOpacity, isSizeZero, isTransitioning]);

  React.useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      true,
    );
    return () => {
      pulseOpacity.value = 0.5;
    };
  }, [pulseOpacity]);

  // 4-rect hole cover: inverse (1 = overlay covers cutout while transitioning / measuring)
  const holeCoverAnimatedProps = useAnimatedProps(() => ({
    opacity: isSizeZero ? 1 : 1 - fadeOpacity.value,
  }));

  const pulseAnimatedProps = useAnimatedProps(() => ({
    opacity: isSizeZero ? 0 : pulseOpacity.value,
  }));

  return { holeCoverAnimatedProps, pulseAnimatedProps };
};

const FourRectOverlay = ({
  geometry,
  windowWidth,
  windowHeight,
  overlayColor,
  pulseColor,
  holeCoverAnimatedProps,
  pulseAnimatedProps,
}: {
  geometry: MaskGeometry;
  windowWidth: number;
  windowHeight: number;
  overlayColor: string;
  pulseColor: string;
  holeCoverAnimatedProps: ReturnType<typeof useAnimatedProps>;
  pulseAnimatedProps: ReturnType<typeof useAnimatedProps>;
}): React.ReactElement => {
  const { x, y, width, height, borderWidth, borderRadius, isSizeZero } = geometry;

  // While measuring, show a full-window dim so the tour never opens with zero feedback
  if (isSizeZero) {
    return (
      <View
        style={[absoluteFill, { backgroundColor: overlayColor }]}
        pointerEvents="auto"
        {...metaAttribute({ name: MetaConstants.TourMask })}
      />
    );
  }

  const topHeight = Math.max(0, y);
  const leftWidth = Math.max(0, x);
  const rightX = x + width;
  const rightWidth = Math.max(0, windowWidth - rightX);
  const bottomY = y + height;
  const bottomHeight = Math.max(0, windowHeight - bottomY);
  const cornerWedges = getCornerWedgePaths(x, y, width, height, borderRadius);

  return (
    <View
      style={absoluteFill}
      pointerEvents="box-none"
      {...metaAttribute({ name: MetaConstants.TourMask })}
    >
      {/* Dim regions around cutout — capture presses so background stays inert */}
      <View
        pointerEvents="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: windowWidth,
          height: topHeight,
          backgroundColor: overlayColor,
        }}
      />
      <View
        pointerEvents="auto"
        style={{
          position: 'absolute',
          top: bottomY,
          left: 0,
          width: windowWidth,
          height: bottomHeight,
          backgroundColor: overlayColor,
        }}
      />
      <View
        pointerEvents="auto"
        style={{
          position: 'absolute',
          top: y,
          left: 0,
          width: leftWidth,
          height,
          backgroundColor: overlayColor,
        }}
      />
      <View
        pointerEvents="auto"
        style={{
          position: 'absolute',
          top: y,
          left: rightX,
          width: rightWidth,
          height,
          backgroundColor: overlayColor,
        }}
      />

      {/* Pulse border + corner wedges + hole-cover fade (inverse of SVG mask hole opacity) */}
      <Svg
        style={{ position: 'absolute', top: 0, left: 0, width: windowWidth, height: windowHeight }}
        viewBox={`0 0 ${windowWidth} ${windowHeight}`}
        pointerEvents="none"
      >
        {/* Fill sharp-rect vs rounded-hole gaps so cutout rx matches web / pulse border */}
        {cornerWedges.map((d) => (
          <Path key={d} d={d} fill={overlayColor} />
        ))}
        <AnimatedRect
          x={x + borderWidth / 2}
          y={y + borderWidth / 2}
          width={width - borderWidth}
          height={height - borderWidth}
          stroke={pulseColor}
          strokeWidth={borderWidth}
          rx={borderRadius - 1}
          ry={borderRadius - 1}
          fill="transparent"
          animatedProps={pulseAnimatedProps}
        />
        <AnimatedRect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={borderRadius}
          ry={borderRadius}
          fill={overlayColor}
          animatedProps={holeCoverAnimatedProps}
        />
      </Svg>
    </View>
  );
};

const _SpotlightPopoverTourMask = ({
  padding,
  size,
  isTransitioning,
}: SpotlightPopoverTourMaskProps): React.ReactElement => {
  const { theme } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const geometry = useMaskGeometry(size, padding);
  const { holeCoverAnimatedProps, pulseAnimatedProps } = useMaskAnimations(
    isTransitioning,
    geometry.isSizeZero,
  );

  const overlayColor = theme.colors.overlay.background.subtle;
  const pulseColor = theme.colors.surface.background.primary.intense;

  // Prefer FourRect on both platforms — SVG Mask is unreliable on iOS Storybook / Fabric hosts
  return (
    <FourRectOverlay
      geometry={geometry}
      windowWidth={windowWidth}
      windowHeight={windowHeight}
      overlayColor={overlayColor}
      pulseColor={pulseColor}
      holeCoverAnimatedProps={holeCoverAnimatedProps}
      pulseAnimatedProps={pulseAnimatedProps}
    />
  );
};

const SpotlightPopoverTourMask = assignWithoutSideEffects(React.memo(_SpotlightPopoverTourMask), {
  displayName: 'TourMask',
});

export { SpotlightPopoverTourMask };
