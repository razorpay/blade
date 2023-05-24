import styled from 'styled-components/native';
import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import type { SvgProps } from './types';
import { useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';

const StyledSvg = styled(SvgNative)((props) => {
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
