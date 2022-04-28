import React from 'react';
import type { ReactElement } from 'react';
import { ClipPath as ClipPathNative } from 'react-native-svg';
import type { ClipPathProps } from './ClipPath.d';

const ClipPath = ({ children, id }: ClipPathProps): ReactElement => {
  return <ClipPathNative children={children} id={id} />;
};

export default ClipPath;
