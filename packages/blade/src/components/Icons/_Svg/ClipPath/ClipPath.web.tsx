import React from 'react';
import type { ReactElement } from 'react';
import type { ClipPathProps } from './ClipPath.d';

const ClipPath = (props: ClipPathProps): ReactElement => {
  return <clipPath {...props} />;
};

export default ClipPath;
