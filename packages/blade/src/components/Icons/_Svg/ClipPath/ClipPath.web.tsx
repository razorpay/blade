import type { ReactElement } from 'react';
import type { ClipPathProps } from './types';
import { metaAttribute } from '~utils';

const ClipPath = ({ children, id }: ClipPathProps): ReactElement => {
  return (
    <clipPath id={id} {...metaAttribute({ name: 'svg-clippath' })}>
      {children}
    </clipPath>
  );
};

export default ClipPath;
