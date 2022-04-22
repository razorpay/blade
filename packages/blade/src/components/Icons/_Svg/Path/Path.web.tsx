import React from 'react';
import type { ReactElement } from 'react';
import type { PathProps } from './Path.d';

const Path = (props: PathProps): ReactElement => {
  return <path {...props} />;
};

export default Path;
