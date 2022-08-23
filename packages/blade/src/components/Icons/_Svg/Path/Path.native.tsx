import type { ReactElement } from 'react';
import { Path as PathNative } from 'react-native-svg';
import type { PathProps, PreventDashedProps } from './Path.d';

const Path = <T extends PathProps>({
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
}: PreventDashedProps<T>): ReactElement => {
  return (
    <PathNative
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
    />
  );
};

export default Path;
