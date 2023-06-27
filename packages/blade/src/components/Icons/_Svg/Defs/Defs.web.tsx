import type { ReactElement } from 'react';
import type { DefsProps } from './types';
import { metaAttribute } from '~utils';

const Defs = ({ children }: DefsProps): ReactElement => {
  return <defs {...metaAttribute({ name: 'svg-defs' })}>{children}</defs>;
};

export default Defs;
