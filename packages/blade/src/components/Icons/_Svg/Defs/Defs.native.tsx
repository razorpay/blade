import type { ReactElement } from 'react';
import { Defs as DefsNative } from 'react-native-svg';
import type { DefsProps } from './types';
import { metaAttribute } from '~utils';

const Defs = ({ children }: DefsProps): ReactElement => {
  return <DefsNative {...metaAttribute({ name: 'svg-defs' })}>{children}</DefsNative>;
};

export default Defs;
