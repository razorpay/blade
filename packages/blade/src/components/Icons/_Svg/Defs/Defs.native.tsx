import type { ReactElement } from 'react';
import { Defs as DefsNative } from 'react-native-svg';
import type { DefsProps } from './Defs.d';

const Defs = ({ children }: DefsProps): ReactElement => {
  return <DefsNative>{children}</DefsNative>;
};

export default Defs;
