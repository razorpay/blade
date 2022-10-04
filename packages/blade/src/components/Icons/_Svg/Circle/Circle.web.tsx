import type { ReactElement } from 'react';
import type { CircleProps } from './types';

const Circle = ({ cx, cy, x, y, r, fill, stroke }: CircleProps): ReactElement => {
  return <circle cx={cx} cy={cy} x={x} y={y} r={r} fill={fill} stroke={stroke} />;
};

export default Circle;
