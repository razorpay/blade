import type { ReactElement } from 'react';
import type { CircleProps } from './Circle.d';

const Circle = ({ cx, cy, x, y, r, fill, stroke }: CircleProps): ReactElement => {
  return <circle cx={cx} cy={cy} x={x} y={y} r={r} fill={fill} stroke={stroke} />;
};

export default Circle;
