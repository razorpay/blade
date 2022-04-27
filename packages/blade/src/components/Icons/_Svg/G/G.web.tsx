import React from 'react';
import type { ReactElement } from 'react';
import type { GProps } from './G.d';

const G = (props: GProps): ReactElement => {
  return <g {...props} />;
};

export default G;
