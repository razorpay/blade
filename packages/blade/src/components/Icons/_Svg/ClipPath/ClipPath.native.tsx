import { ClipPath as ClipPathNative } from 'react-native-svg';
import { metaAttribute } from '~utils/metaAttribute';

import type { ReactElement } from 'react';
import type { ClipPathProps } from './types';

const ClipPath = ({ children, id }: ClipPathProps): ReactElement => {
  return (
    <ClipPathNative id={id} {...metaAttribute({ name: 'svg-clippath' })}>
      {children}
    </ClipPathNative>
  );
};

export default ClipPath;
