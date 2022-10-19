import type { ReactElement } from 'react';
import type { DefsProps } from './types';

const Defs = ({ children }: DefsProps): ReactElement => {
  return <defs>{children}</defs>;
};

export default Defs;
