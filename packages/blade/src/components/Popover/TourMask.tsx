/* eslint-disable @typescript-eslint/restrict-plus-operands */
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import React from 'react';
import type { LayoutRectangle } from 'react-native';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '~utils';

type ShapeMaskProps = {
  padding: number;
  size: LayoutRectangle;
};

const ShapeMask = ({ size, padding }: ShapeMaskProps): React.ReactElement => {
  const width = size.width + padding;
  const height = size.height + padding;
  const x = size.x - (width - size.width) / 2;
  const y = size.y - (height - size.height) / 2;

  return <Rect x={x} y={y} width={width} height={height} fill="black" rx={4} ry={4} />;
};

type TourMaskProps = {
  size: LayoutRectangle;
};
const TourMask = ({ size }: TourMaskProps): React.ReactElement => {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  return (
    <Svg
      style={[StyleSheet.absoluteFill]}
      height="100%"
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      shouldRasterizeIOS={true}
      renderToHardwareTextureAndroid={true}
    >
      <Defs>
        <Mask id="mask" x={0} y={0} height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <ShapeMask size={size} padding={10} />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill={theme.colors.surface.overlay.background[800]}
        mask="url(#mask)"
        opacity={1}
      />
    </Svg>
  );
};

export { TourMask };
