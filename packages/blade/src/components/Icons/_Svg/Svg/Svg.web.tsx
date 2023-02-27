import styled from 'styled-components';
import type { ReactElement } from 'react';
import type { SvgProps } from './types';
import { metaAttribute, makeAccessible, MetaConstants, useStyledProps } from '~utils';

const StyledSvg = styled.svg<SvgProps>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return styledPropsCSSObject;
});

const Svg = ({
  children,
  height,
  viewBox,
  width,
  fill,
  ...styledProps
}: SvgProps): ReactElement => {
  return (
    <StyledSvg
      {...styledProps}
      {...makeAccessible({ hidden: true })}
      {...metaAttribute(MetaConstants.Component, MetaConstants.Icon)}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
    >
      {children}
    </StyledSvg>
  );
};

export default Svg;
