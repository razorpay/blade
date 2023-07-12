import styled from 'styled-components';
import type { ReactElement } from 'react';
import type { SvgProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';

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
  testID,
  display, // TODO: remove this
  ...styledProps
}: SvgProps): ReactElement => {
  return (
    <StyledSvg
      {...makeAccessible({ hidden: true })}
      {...metaAttribute({ name: MetaConstants.Icon, testID })}
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
