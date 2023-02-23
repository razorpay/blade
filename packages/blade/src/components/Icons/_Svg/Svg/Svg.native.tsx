import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import type { SvgProps } from './types';
import { getStyledProps, makeAccessible } from '~utils';
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
      <SvgNative
        {...makeAccessible({ hidden: true })}
        height={height}
        viewBox={viewBox}
        width={width}
        fill={fill}
      >
        {children}
      </SvgNative>
    </BaseBox>
  );
};

export default Svg;
