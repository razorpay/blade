import type { ReactElement } from 'react';
import { Circle as CircleNative } from 'react-native-svg';
import type { CircleProps } from './Circle.d';

const Circle = ({ cx, cy, x, y, r, fill, stroke }: CircleProps): ReactElement => {
  return <CircleNative cx={cx} cy={cy} x={x} y={y} r={r} fill={fill} stroke={stroke} />;
};

export default Circle;
