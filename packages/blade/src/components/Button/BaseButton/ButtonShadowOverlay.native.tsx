import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Mask,
} from 'react-native-svg';
import type { ButtonCornerRadii } from './types';

type ButtonShadowOverlayProps = {
  borderRadius: number;
  /**
   * Per-corner radii. When the corners differ (first/last button in a
   * ButtonGroup), the border ring is drawn as a rounded-rect Path so the outer
   * corners follow the group's radius instead of being clipped into a square.
   */
  borderRadii?: ButtonCornerRadii;
  highlightColor?: string;
  highlightHeight?: number;
  shadowColor?: string;
  shadowHeight?: number;
  borderColor: string;
  ringWidth?: number;
  showGradient?: boolean;
  /**
   * When true (button is inside a ButtonGroup), the top highlight and bottom
   * shadow are drawn only on the horizontal top/bottom edges — their vertical
   * side segments are pushed outside the button and clipped away. This prevents
   * the inset highlight/shadow from doubling up and looking thick at the
   * junction between two adjacent buttons. The actual border ring is unaffected.
   */
  isInsetShadowSidesFlattened?: boolean;
};

/**
 * Builds an SVG path for a rectangle with independent corner radii, using pixel
 * coordinates (react-native-svg's <Rect rx> only supports a uniform radius).
 */
const buildRoundedRectPath = (width: number, height: number, radii: ButtonCornerRadii): string => {
  const maxRadius = Math.min(width, height) / 2;
  const tl = Math.max(0, Math.min(radii.topLeft, maxRadius));
  const tr = Math.max(0, Math.min(radii.topRight, maxRadius));
  const br = Math.max(0, Math.min(radii.bottomRight, maxRadius));
  const bl = Math.max(0, Math.min(radii.bottomLeft, maxRadius));

  return [
    `M ${tl} 0`,
    `H ${width - tr}`,
    tr ? `A ${tr} ${tr} 0 0 1 ${width} ${tr}` : `L ${width} 0`,
    `V ${height - br}`,
    br ? `A ${br} ${br} 0 0 1 ${width - br} ${height}` : `L ${width} ${height}`,
    `H ${bl}`,
    bl ? `A ${bl} ${bl} 0 0 1 0 ${height - bl}` : `L 0 ${height}`,
    `V ${tl}`,
    tl ? `A ${tl} ${tl} 0 0 1 ${tl} 0` : `L 0 0`,
    'Z',
  ].join(' ');
};

const ButtonShadowOverlay = ({
  borderRadius,
  borderRadii,
  highlightColor,
  highlightHeight = 1.5,
  shadowColor,
  shadowHeight = 1.5,
  borderColor,
  ringWidth = 0.5,
  showGradient = false,
  isInsetShadowSidesFlattened = false,
}: ButtonShadowOverlayProps): React.ReactElement => {
  const radii: ButtonCornerRadii = borderRadii ?? {
    topLeft: borderRadius,
    topRight: borderRadius,
    bottomLeft: borderRadius,
    bottomRight: borderRadius,
  };

  const isUniform =
    radii.topLeft === radii.topRight &&
    radii.topRight === radii.bottomRight &&
    radii.bottomRight === radii.bottomLeft;

  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  // Only fall back to the pixel-measured Path when the corners actually differ.
  // Uniform corners keep the percentage-based <Rect> (no layout measurement, no
  // first-frame flicker).
  const usePath = !isUniform && size.width > 0 && size.height > 0;
  const pathD = usePath ? buildRoundedRectPath(size.width, size.height, radii) : '';

  const renderShape = (
    key: string,
    {
      stroke,
      strokeWidth,
      fill = 'none',
      mask,
      horizontalOnly = false,
    }: {
      stroke?: string;
      strokeWidth?: number;
      fill?: string;
      mask?: string;
      horizontalOnly?: boolean;
    },
  ): React.ReactElement | null => {
    if (horizontalOnly) {
      // Extend well past the left/right edges so only the top & bottom horizontal
      // strokes remain visible (the vertical sides fall outside the button and
      // are clipped by its `overflow: hidden`). Keeps the top/bottom inset
      // highlight/shadow while avoiding doubled thickness at group junctions.
      return (
        <Rect
          key={key}
          x="-50%"
          y="0"
          width="200%"
          height="100%"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          mask={mask}
        />
      );
    }

    if (usePath) {
      return (
        <Path
          key={key}
          d={pathD}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          mask={mask}
        />
      );
    }

    // Non-uniform corners but size not measured yet — render a uniform Rect
    // fallback using the max corner radius to avoid a one-frame flash where
    // border, highlight, and shadow are absent. Once onLayout fires, the
    // exact per-corner Path replaces this fallback.
    if (!isUniform) {
      const maxRadius = Math.max(
        radii.topLeft,
        radii.topRight,
        radii.bottomLeft,
        radii.bottomRight,
      );
      return (
        <Rect
          key={key}
          x={0}
          y={0}
          width="100%"
          height="100%"
          rx={maxRadius}
          ry={maxRadius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          mask={mask}
        />
      );
    }

    return (
      <Rect
        key={key}
        x={0}
        y={0}
        width="100%"
        height="100%"
        rx={radii.topLeft}
        ry={radii.topLeft}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        mask={mask}
      />
    );
  };

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      {...(!isUniform ? { onLayout: handleLayout } : {})}
    >
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="white" stopOpacity={1} />
            <Stop offset="1" stopColor="white" stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id="bottomFade" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="white" stopOpacity={1} />
            <Stop offset="1" stopColor="white" stopOpacity={0} />
          </LinearGradient>
          <Mask id="topMask">
            <Rect x="0" y="0" width="100%" height="20%" fill="url(#topFade)" />
          </Mask>
          <Mask id="bottomMask">
            <Rect x="0" y="80%" width="100%" height="20%" fill="url(#bottomFade)" />
          </Mask>
          {showGradient ? (
            <RadialGradient
              id="btnGlow"
              cx={0}
              cy={0}
              rx={64}
              ry={64}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#ffffff" stopOpacity={0.18} />
              <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
            </RadialGradient>
          ) : null}
        </Defs>
        {highlightColor
          ? renderShape('highlight-bottom', {
              stroke: highlightColor,
              strokeWidth: 7,
              mask: 'url(#bottomMask)',
              horizontalOnly: isInsetShadowSidesFlattened,
            })
          : null}
        {highlightColor
          ? renderShape('highlight-top', {
              stroke: highlightColor,
              strokeWidth: (highlightHeight + 0.5) * 2,
              mask: 'url(#topMask)',
              horizontalOnly: isInsetShadowSidesFlattened,
            })
          : null}
        {renderShape('border', { stroke: borderColor, strokeWidth: ringWidth * 2 })}
        {shadowColor
          ? renderShape('shadow-bottom', {
              stroke: shadowColor,
              strokeWidth: (shadowHeight + 1) * 2,
              mask: 'url(#bottomMask)',
              horizontalOnly: isInsetShadowSidesFlattened,
            })
          : null}
        {showGradient ? renderShape('glow', { fill: 'url(#btnGlow)' }) : null}
      </Svg>
    </View>
  );
};

export { ButtonShadowOverlay };
export type { ButtonShadowOverlayProps };
