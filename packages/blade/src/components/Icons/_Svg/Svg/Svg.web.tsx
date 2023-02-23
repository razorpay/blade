import type { ReactElement } from 'react';
import type { SvgProps } from './types';
import { metaAttribute, makeAccessible, MetaConstants, getStyledProps } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const Svg = ({
  children,
  height,
  viewBox,
  width,
  fill,
  ...styledProps
}: SvgProps): ReactElement => {
  return (
    <BaseBox {...getStyledProps(styledProps)}>
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
    </BaseBox>
  );
};

export default Svg;
