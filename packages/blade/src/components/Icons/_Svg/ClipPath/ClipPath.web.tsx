import type { ReactElement } from 'react';
import type { ClipPathProps } from './ClipPath.d';

const ClipPath = ({ children, id }: ClipPathProps): ReactElement => {
  return <clipPath id={id}>{children}</clipPath>;
};

export default ClipPath;
