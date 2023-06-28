import type { ReactElement } from 'react';
import type { GProps } from './types';
import { metaAttribute } from '~utils';

const G = ({ clipPath, fill, children }: GProps): ReactElement => {
  return (
    <g clipPath={clipPath} fill={fill} {...metaAttribute({ name: 'svg-g' })}>
      {children}
    </g>
  );
};

export default G;
