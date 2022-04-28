import React from 'react';
import type { ReactElement } from 'react';
import { ClipPath as ClipPathNative } from 'react-native-svg';
import type { ClipPathProps } from './ClipPath.d';

const ClipPath = (props: ClipPathProps): ReactElement => {
  return <ClipPathNative {...props} />;
};

export default ClipPath;
