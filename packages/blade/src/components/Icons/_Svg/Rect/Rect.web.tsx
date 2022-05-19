import type { ReactElement } from 'react';
import type { RectProps } from './Rect.d';

const Rect = ({ height, width, rx, ry, x, y, fill }: RectProps): ReactElement => {
  return <rect height={height} width={width} rx={rx} ry={ry} x={x} y={y} fill={fill} />;
};

export default Rect;
