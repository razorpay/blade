import React from 'react';
import type { ReactElement } from 'react';
import { Path as PathNative } from 'react-native-svg';
import type { PathProps } from './Path.d';

const Path = (props: PathProps): ReactElement => {
  return <PathNative {...props} />;
};

export default Path;
