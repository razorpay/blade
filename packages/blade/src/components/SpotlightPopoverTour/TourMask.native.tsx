import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Svg, Rect, Defs, Mask } from '~components/Icons/_Svg';
import type { SpotlightPopoverTourMaskRect } from './types';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type SpotlightPopoverTourMaskProps = {
  padding: number;
  size: SpotlightPopoverTourMaskRect;
  isTransitioning: boolean;
};

const _SpotlightPopoverTourMask = ({
  padding,
  size,
}: SpotlightPopoverTourMaskProps): React.ReactElement => {
  const { theme } = useTheme();
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

  const width = size.width + padding;
  const height = size.height + padding;
  const x = size.x - (width - size.width) / 2;
  const y = size.y - (height - size.height) / 2;

  const borderWidth = theme.spacing[1];
  const borderRadius = theme.spacing[2];

  const isSizeZero = size.width === 0 || size.height === 0;

  // Pulsing animation for the border
  const pulseOpacity = useSharedValue(1);
  React.useEffect(() => {
    pulseOpacity.value = withRepeat(
      withSequence(withTiming(0.5, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true,
    );
  }, [pulseOpacity]);

  const animatedPulseProps = useAnimatedProps(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      viewBox={`0 0 ${windowWidth} ${windowHeight}`}
      {...metaAttribute({ name: MetaConstants.TourMask })}
    >
      <Defs>
        <Mask id="tour-mask" x={0} y={0} height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          {!isSizeZero && (
            <Rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={borderRadius}
              ry={borderRadius}
              fill="#000"
            />
          )}
        </Mask>
      </Defs>

      {/* Pulsing border around spotlight */}
      {!isSizeZero && (
        <AnimatedRect
          animatedProps={animatedPulseProps}
          x={x + borderWidth / 2}
          y={y + borderWidth / 2}
          width={width - borderWidth}
          height={height - borderWidth}
          stroke={theme.colors.surface.background.primary.intense}
          strokeWidth={borderWidth}
          rx={borderRadius - 1}
          ry={borderRadius - 1}
          fill="transparent"
        />
      )}

      {/* Overlay with mask hole */}
      <Rect
        height="100%"
        width="100%"
        mask="url(#tour-mask)"
        fill={theme.colors.overlay.background.subtle}
      />
    </Svg>
  );
};

const SpotlightPopoverTourMask = assignWithoutSideEffects(React.memo(_SpotlightPopoverTourMask), {
  displayName: 'TourMask',
});
export { SpotlightPopoverTourMask };
