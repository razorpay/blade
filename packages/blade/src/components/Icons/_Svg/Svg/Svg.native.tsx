import React from 'react';
import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import type { SvgProps } from './Svg.d';

const Svg = ({ children, height, viewBox, width, fill, xmlns }: SvgProps): ReactElement => {
  return <SvgNative {...{ children, height, viewBox, width, fill, xmlns }} />;
};

export default Svg;
