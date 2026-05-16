import { metaAttribute } from '~utils/metaAttribute';

import type { ReactElement } from 'react';
import type { DefsProps } from './types';

const Defs = ({ children }: DefsProps): ReactElement => {
  return <defs {...metaAttribute({ name: 'svg-defs' })}>{children}</defs>;
};

export default Defs;
