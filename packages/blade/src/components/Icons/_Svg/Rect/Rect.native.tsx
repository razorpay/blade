import type { ReactElement } from 'react';
import { Rect as RectNative } from 'react-native-svg';
import type { RectProps } from './types';
import { metaAttribute } from '~utils';

const Rect = ({ height, width, fill, rx, ry, x, y }: RectProps): ReactElement => {
  return (
    <RectNative
      height={height}
      width={width}
      rx={rx}
      ry={ry}
      x={x}
      y={y}
      fill={fill}
      {...metaAttribute({ name: 'svg-rect' })}
    />
  );
};

export default Rect;
