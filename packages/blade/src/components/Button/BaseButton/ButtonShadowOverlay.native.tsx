import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, ClipPath } from 'react-native-svg';

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
        <ClipPath id="topClip">
          <Rect x="0" y="0" width="100%" height="20%" />
        </ClipPath>
        <ClipPath id="bottomClip">
          <Rect x="0" y="80%" width="100%" height="20%" />
        </ClipPath>
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
          clipPath="url(#bottomClip)"
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
          strokeWidth={highlightHeight * 2}
          clipPath="url(#topClip)"
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
          clipPath="url(#bottomClip)"
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
