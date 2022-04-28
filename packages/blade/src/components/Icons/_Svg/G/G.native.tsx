import React from 'react';
import type { ReactElement } from 'react';
import { G as GNative } from 'react-native-svg';
import type { GProps } from './G.d';

const G = ({ clipPath, fill, children }: GProps): ReactElement => {
  return <GNative clipPath={clipPath} fill={fill} children={children} />;
};

export default G;
