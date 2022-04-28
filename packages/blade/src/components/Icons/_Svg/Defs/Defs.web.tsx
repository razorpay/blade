import React from 'react';
import type { ReactElement } from 'react';
import type { DefsProps } from './Defs.d';

const Defs = ({ children }: DefsProps): ReactElement => {
  return <defs children={children} />;
};

export default Defs;
