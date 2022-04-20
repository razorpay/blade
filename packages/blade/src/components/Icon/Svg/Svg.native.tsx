import React from 'react';
import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import type { SvgProps } from './Svg.d';

const Svg = (props: SvgProps): ReactElement => {
  return <SvgNative {...props} />;
};

export default Svg;
