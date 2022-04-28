import React from 'react';
import type { ReactElement } from 'react';
import type { SvgProps } from './Svg.d';

const Svg = ({ children, height, viewBox, width, fill }: SvgProps): ReactElement => {
  return <svg children={children} height={height} viewBox={viewBox} width={width} fill={fill} />;
};

export default Svg;
