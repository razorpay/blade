import type { ReactElement } from 'react';
import type { Exact, PathProps } from './types';

const Path = <Props extends Exact<PathProps, Props>>({
  d,
  clipPath,
  clipRule,
  fill,
  fillOpacity,
  fillRule,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  is,
}: Props): ReactElement => {
  return (
    <path
      d={d}
      clipPath={clipPath}
      clipRule={clipRule}
      fill={fill}
      fillOpacity={fillOpacity}
      fillRule={fillRule}
      stroke={stroke}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      strokeWidth={strokeWidth}
      // @ts-expect-error allows browser to recognise x3dom elements
      is={is}
    />
  );
};

export default Path;
