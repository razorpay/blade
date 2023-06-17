/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components/native';
import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import React from 'react';
import type { SvgProps } from './types';
import { useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';

const StyledSvg = styled(SvgNative)((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return styledPropsCSSObject;
});

const _Svg: React.ForwardRefRenderFunction<any, SvgProps> = (
  { children, height, viewBox, width, fill, ...styledProps },
  ref,
): ReactElement => {
  return (
    <StyledSvg
      {...makeAccessible({ hidden: true })}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
      ref={ref}
      {...styledProps}
    >
      {children}
    </StyledSvg>
  );
};

const Svg = React.forwardRef(_Svg);

export default Svg;
