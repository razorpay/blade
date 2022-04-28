import React from 'react';
import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import type { SvgProps } from './Svg.d';

const Svg = ({ children, height, viewBox, width, fill }: SvgProps): ReactElement => {
  return (
    <SvgNative children={children} height={height} viewBox={viewBox} width={width} fill={fill} />
  );
};

export default Svg;
