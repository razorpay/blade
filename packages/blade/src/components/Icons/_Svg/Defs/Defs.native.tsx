import { Defs as DefsNative } from 'react-native-svg';
import { metaAttribute } from '~utils/metaAttribute';

import type { ReactElement } from 'react';
import type { DefsProps } from './types';

const Defs = ({ children }: DefsProps): ReactElement => {
  return <DefsNative {...metaAttribute({ name: 'svg-defs' })}>{children}</DefsNative>;
};

export default Defs;
