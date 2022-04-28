import React from 'react';
import type { ReactElement } from 'react';
import type { SvgProps } from './Svg.d';

const Svg = ({ children, height, viewBox, width, fill }: SvgProps): ReactElement => {
  return (
    <svg height={height} viewBox={viewBox} width={width} fill={fill}>
      {children}
    </svg>
  );
};

export default Svg;
