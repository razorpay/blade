import type { ReactElement } from 'react';
import { ClipPath as ClipPathNative } from 'react-native-svg';
import type { ClipPathProps } from './types';

const ClipPath = ({ children, id }: ClipPathProps): ReactElement => {
  return <ClipPathNative id={id}>{children}</ClipPathNative>;
};

export default ClipPath;
