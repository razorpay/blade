import type { ReactElement } from 'react';
import { G as GNative } from 'react-native-svg';
import type { GProps } from './types';
import { metaAttribute } from '~utils/metaAttribute';

const G = ({ clipPath, fill, children }: GProps): ReactElement => {
  return (
    <GNative clipPath={clipPath} fill={fill} {...metaAttribute({ name: 'svg-g' })}>
      {children}
    </GNative>
  );
};

export default G;
