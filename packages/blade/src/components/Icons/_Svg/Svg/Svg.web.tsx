import type { ReactElement } from 'react';
import type { SvgProps } from './Svg.d';
import { makeAccessible } from '~utils';

const Svg = ({ children, height, viewBox, width, fill }: SvgProps): ReactElement => {
  return (
    <svg
      {...makeAccessible({ hidden: true })}
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
