import React from 'react';
import type { ReactElement } from 'react';
import { Path as PathNative } from 'react-native-svg';
import type { PathProps } from './Path.d';

const Path = ({
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
}: PathProps): ReactElement => {
  return (
    <PathNative
      {...{
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
      }}
    />
  );
};

export default Path;
