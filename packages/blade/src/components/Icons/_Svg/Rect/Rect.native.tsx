import type { ReactElement } from 'react';
import { Rect as RectNative } from 'react-native-svg';
import type { RectProps } from './types';
import { metaAttribute } from '~utils/metaAttribute';

const Rect = ({
  height,
  width,
  fill,
  fillOpacity,
  rx,
  ry,
  x,
  y,
  transform,
}: RectProps): ReactElement => {
  return (
    <RectNative
      height={height}
      width={width}
      rx={rx}
      ry={ry}
      x={x}
      y={y}
      fill={fill}
      transform={transform}
      fillOpacity={fillOpacity}
      {...metaAttribute({ name: 'svg-rect' })}
    />
  );
};

export default Rect;
