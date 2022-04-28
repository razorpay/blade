import React from 'react';
import type { ReactElement } from 'react';
import type { ClipPathProps } from './ClipPath.d';

const ClipPath = ({ children, id }: ClipPathProps): ReactElement => {
  return <clipPath children={children} id={id} />;
};

export default ClipPath;
