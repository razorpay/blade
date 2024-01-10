import type { ReactElement } from 'react';
import type { CircleProps } from './types';
import { metaAttribute } from '~utils/metaAttribute';

const Circle = ({
  cx,
  cy,
  x,
  y,
  r,
  fill,
  stroke,
  strokeWidth,
  fillOpacity,
}: CircleProps): ReactElement => {
  return (
    <circle
      cx={cx}
      cy={cy}
      x={x}
      y={y}
      r={r}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fillOpacity={fillOpacity}
      {...metaAttribute({ name: 'svg-circle' })}
    />
  );
};

export default Circle;
