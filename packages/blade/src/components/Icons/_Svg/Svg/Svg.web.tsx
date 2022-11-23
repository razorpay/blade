import type { ReactElement } from 'react';
import type { SvgProps } from './types';
import { metaAttribute, makeAccessible, MetaConstants } from '~utils';

const Svg = ({ children, height, viewBox, width, fill }: SvgProps): ReactElement => {
  return (
    <svg
      {...makeAccessible({ hidden: true })}
      {...metaAttribute(MetaConstants.Component, MetaConstants.Icon)}
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
