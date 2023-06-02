/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components/native';
import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import React from 'react';
import type { SvgProps } from './types';
import { makeAccessible } from '~utils';
import { useStyledProps } from '~components/Box/styledProps';

const StyledSvg = styled(SvgNative)((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return styledPropsCSSObject;
});

const Svg = React.forwardRef<SvgProps, any>(
  ({ children, height, viewBox, width, fill, ...styledProps }, ref): ReactElement => {
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
  },
);

export default Svg;
