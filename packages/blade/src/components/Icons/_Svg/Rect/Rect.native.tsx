import type { ReactElement } from 'react';
import { Rect as RectNative } from 'react-native-svg';
import type { RectProps } from './types';

const Rect = ({ height, width, fill, rx, ry, x, y }: RectProps): ReactElement => {
  return <RectNative height={height} width={width} rx={rx} ry={ry} x={x} y={y} fill={fill} />;
};

export default Rect;
