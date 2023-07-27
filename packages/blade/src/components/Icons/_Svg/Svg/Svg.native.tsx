/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components/native';
import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import React from 'react';
import type { SvgProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps, useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';

const StyledSvg = styled(SvgNative)((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return styledPropsCSSObject;
});

const _Svg: React.ForwardRefRenderFunction<any, SvgProps> = (
  { children, height, viewBox, width, fill, ...styledProps },
  ref,
): ReactElement => {
  const { order, ...fiteredStyledProps } = getStyledProps(styledProps);

  return (
    <StyledSvg
      {...makeAccessible({ hidden: true })}
      {...metaAttribute({ name: MetaConstants.Icon })}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
      ref={ref}
      {...fiteredStyledProps}
    >
      {children}
    </StyledSvg>
  );
};

const Svg = React.forwardRef(_Svg);

export default Svg;
