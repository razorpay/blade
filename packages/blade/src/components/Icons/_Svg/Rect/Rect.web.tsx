import type { ReactElement } from 'react';
import type { RectProps } from './types';
import { metaAttribute } from '~utils/metaAttribute';

const Rect = ({
  height,
  width,
  rx,
  ry,
  x,
  y,
  fill,
  fillOpacity,
  transform,
}: RectProps): ReactElement => {
  return (
    <rect
      {...metaAttribute({ name: 'svg-rect' })}
      height={height}
      width={width}
      rx={rx}
      ry={ry}
      x={x}
      y={y}
      fill={fill}
      fillOpacity={fillOpacity}
      transform={transform}
    />
  );
};

export default Rect;
