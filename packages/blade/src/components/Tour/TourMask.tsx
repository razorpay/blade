/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { useTheme } from '~utils';
import { useWindowSize } from '~utils/useWindowSize';

type Rect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type ShapeMaskProps = {
  size: Rect;
  padding: number;
};
const ShapeMask = ({ size, padding }: ShapeMaskProps): React.ReactElement => {
  const width = size.width + padding;
  const height = size.height + padding;
  const x = size.x - (width - size.width) / 2;
  const y = size.y - (height - size.height) / 2;

  return <rect x={x} y={y} width={width} height={height} fill="black" rx={4} ry={4} />;
};

type TourMaskProps = {
  padding: number;
  size: Rect;
};
const TourMask = ({ padding, size }: TourMaskProps) => {
  const { theme } = useTheme();
  const { width, height } = useWindowSize();

  return (
    <svg
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <mask id="tour-mask" x={0} y={0} height="100%" width="100%">
        <rect height="100%" width="100%" fill="#fff" />
        <ShapeMask size={size} padding={padding} />
      </mask>
      <rect
        height="100%"
        width="100%"
        fill={theme.colors.surface.overlay.background[800]}
        mask="url(#tour-mask)"
      />
    </svg>
  );
};

export { TourMask };
export type { Rect };
