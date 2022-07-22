import type { CSSObject } from 'styled-components';
import type { Theme } from '..';
import type { BoxProps } from './Box';
import { getIn, makeSize, makeSpace } from '~utils';

const getBoxStyles = ({
  theme,
  display,
  flex,
  flexDirection,
  alignItems,
  justifyContent,
  alignSelf,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
}: BoxProps & { theme: Theme }): CSSObject => ({
  display,
  flex,
  flexDirection,
  alignItems,
  justifyContent,
  alignSelf,
  paddingTop: paddingTop ? makeSpace(getIn(theme, paddingTop)) : undefined,
  paddingBottom: paddingBottom ? makeSpace(getIn(theme, paddingBottom)) : undefined,
  paddingLeft: paddingLeft ? makeSpace(getIn(theme, paddingLeft)) : undefined,
  paddingRight: paddingRight ? makeSpace(getIn(theme, paddingRight)) : undefined,
  minHeight: minHeight ? makeSize(minHeight) : undefined,
  minWidth: minWidth ? makeSize(minWidth) : undefined,
  maxHeight: maxHeight ? makeSize(maxHeight) : undefined,
  maxWidth: maxWidth ? makeSize(maxWidth) : undefined,
});

export default getBoxStyles;
