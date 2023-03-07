import styled from 'styled-components';
import type { ReactElement } from 'react';
import type { SvgProps } from './types';
import { metaAttribute, makeAccessible, MetaConstants } from '~utils';
import { useStyledProps } from '~components/Box/styled-props';

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
      {...makeAccessible({ hidden: true })}
      {...metaAttribute(MetaConstants.Component, MetaConstants.Icon)}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
      {...styledProps}
    >
      {children}
    </StyledSvg>
  );
};

export default Svg;
