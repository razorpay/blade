import { G as GNative } from 'react-native-svg';
import { metaAttribute } from '~utils/metaAttribute';

import type { ReactElement } from 'react';
import type { GProps } from './types';

const G = ({ clipPath, fill, children }: GProps): ReactElement => {
  return (
    <GNative clipPath={clipPath} fill={fill} {...metaAttribute({ name: 'svg-g' })}>
      {children}
    </GNative>
  );
};

export default G;
