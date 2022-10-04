import type { ReactElement } from 'react';
import type { ClipPathProps } from './types';

const ClipPath = ({ children, id }: ClipPathProps): ReactElement => {
  return <clipPath id={id}>{children}</clipPath>;
};

export default ClipPath;
