import styled from 'styled-components';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';

import type { ReactElement } from 'react';
import type { SvgProps } from './types';

const StyledSvg = styled.svg<SvgProps & { styledDisplay: SvgProps['display'] }>(
  ({ styledDisplay, ...props }) => {
    const styledPropsCSSObject = useStyledProps({ ...props, display: styledDisplay });
    return styledPropsCSSObject;
  },
);

const Svg = ({
  children,
  height,
  viewBox,
  width,
  fill,
  testID,
  display,
  fillOpacity,
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
      // svg has its own display prop, which conflicts with our styled display prop
      styledDisplay={display}
      fillOpacity={fillOpacity}
      {...styledProps}
    >
      {children}
    </StyledSvg>
  );
};

export default Svg;
