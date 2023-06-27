import type { ReactElement } from 'react';
import { Circle as CircleNative } from 'react-native-svg';
import type { CircleProps } from './types';
import { metaAttribute } from '~utils';

const Circle = ({ cx, cy, x, y, r, fill, stroke, strokeWidth }: CircleProps): ReactElement => {
  return (
    <CircleNative
      cx={cx}
      cy={cy}
      x={x}
      y={y}
      r={r}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...metaAttribute({ name: 'svg-circle' })}
    />
  );
};

export default Circle;
