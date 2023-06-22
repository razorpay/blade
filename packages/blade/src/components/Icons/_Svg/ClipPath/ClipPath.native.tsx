import type { ReactElement } from 'react';
import { ClipPath as ClipPathNative } from 'react-native-svg';
import type { ClipPathProps } from './types';
import { metaAttribute } from '~utils';

const ClipPath = ({ children, id }: ClipPathProps): ReactElement => {
  return (
    <ClipPathNative id={id} {...metaAttribute({ name: 'svg-clippath' })}>
      {children}
    </ClipPathNative>
  );
};

export default ClipPath;
