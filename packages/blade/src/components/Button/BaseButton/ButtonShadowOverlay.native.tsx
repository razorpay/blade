import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  Mask,
} from 'react-native-svg';

type ButtonShadowOverlayProps = {
  borderRadius: number;
  highlightColor?: string;
  highlightHeight?: number;
  shadowColor?: string;
  shadowHeight?: number;
  borderColor: string;
  ringWidth?: number;
  showGradient?: boolean;
};

const ButtonShadowOverlay = ({
  borderRadius,
  highlightColor,
  highlightHeight = 1.5,
  shadowColor,
  shadowHeight = 1.5,
  borderColor,
  ringWidth = 0.5,
  showGradient = false,
}: ButtonShadowOverlayProps): React.ReactElement => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
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
      {highlightColor ? (
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={highlightColor}
          strokeWidth={4}
          mask="url(#bottomMask)"
        />
      ) : null}
      {highlightColor ? (
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={highlightColor}
          strokeWidth={(highlightHeight + 0.5) * 2}
          mask="url(#topMask)"
        />
      ) : null}
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={borderRadius}
        ry={borderRadius}
        fill="none"
        stroke={borderColor}
        strokeWidth={ringWidth * 2}
      />
      {shadowColor ? (
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={shadowColor}
          strokeWidth={shadowHeight * 2}
          mask="url(#bottomMask)"
        />
      ) : null}
      {showGradient ? (
        <Rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          fill="url(#btnGlow)"
        />
      ) : null}
    </Svg>
  </View>
);

export { ButtonShadowOverlay };
export type { ButtonShadowOverlayProps };
