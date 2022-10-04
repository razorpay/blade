import type { ReactElement } from 'react';
import { G as GNative } from 'react-native-svg';
import type { GProps } from './types';

const G = ({ clipPath, fill, children }: GProps): ReactElement => {
  return (
    <GNative clipPath={clipPath} fill={fill}>
      {children}
    </GNative>
  );
};

export default G;
