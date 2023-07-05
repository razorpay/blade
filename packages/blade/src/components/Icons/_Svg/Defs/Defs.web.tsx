import type { ReactElement } from 'react';
import type { DefsProps } from './types';
import { metaAttribute } from '~utils/metaAttribute';

const Defs = ({ children }: DefsProps): ReactElement => {
  return <defs {...metaAttribute({ name: 'svg-defs' })}>{children}</defs>;
};

export default Defs;
