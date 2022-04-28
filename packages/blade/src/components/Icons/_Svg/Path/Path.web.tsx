import React from 'react';
import type { ReactElement } from 'react';
import type { PathProps } from './Path.d';

const Path = ({
  d,
  clipPath,
  clipRule,
  fill,
  fillOpacity,
  fillRule,
  height,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  viewBox,
  width,
}: PathProps): ReactElement => {
  return (
    <path
      {...{
        d,
        clipPath,
        clipRule,
        fill,
        fillOpacity,
        fillRule,
        height,
        stroke,
        strokeLinecap,
        strokeLinejoin,
        strokeWidth,
        viewBox,
        width,
      }}
    />
  );
};

export default Path;
