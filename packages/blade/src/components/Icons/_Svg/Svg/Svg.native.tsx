import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import type { SvgProps } from './Svg.d';
import { makeAccessible } from '~utils';

const Svg = ({ children, height, viewBox, width, fill }: SvgProps): ReactElement => {
  return (
    <SvgNative
      {...makeAccessible({ hidden: true })}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
    >
      {children}
    </SvgNative>
  );
};

export default Svg;
