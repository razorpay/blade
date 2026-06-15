import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

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
    {highlightColor ? (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: highlightHeight,
          backgroundColor: highlightColor,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }}
      />
    ) : null}
    {shadowColor ? (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: borderRadius,
          right: borderRadius,
          height: shadowHeight,
          backgroundColor: shadowColor,
        }}
      />
    ) : null}
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderTopWidth: ringWidth,
        borderBottomWidth: ringWidth,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: borderColor,
        borderRadius: borderRadius,
      }}
    />
    {showGradient ? (
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
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
        </Defs>
        <Rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          fill="url(#btnGlow)"
        />
      </Svg>
    ) : null}
  </View>
);

export { ButtonShadowOverlay };
export type { ButtonShadowOverlayProps };
