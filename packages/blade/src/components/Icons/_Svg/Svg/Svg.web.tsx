import type { ReactElement } from 'react';
import type { SvgProps } from './types';
import { metaAttribute, makeAccessible, MetaConstants } from '~utils';

const Svg = ({ children, height, viewBox, width, fill, testID }: SvgProps): ReactElement => {
  return (
    <svg
      {...makeAccessible({ hidden: true })}
      {...metaAttribute({ name: MetaConstants.Icon, testID })}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
    >
      {children}
    </svg>
  );
};

export default Svg;
