import React from 'react';
import type { ReactElement } from 'react';
import { G as GNative } from 'react-native-svg';
import type { GProps } from './G.d';

const G = (props: GProps): ReactElement => {
  return <GNative {...props} />;
};

export default G;
