import type { CSSObject } from 'styled-components';
import getIn from '../../utils/getIn';
import makeSize from '../../utils/makeSize';
import makeSpace from '../../utils/makeSpace';
import type { Theme } from '../BladeProvider';
import type { BoxProps } from './Box';

const getBoxStyles = ({
  theme,
  display,
  flex,
  flexDirection,
  alignItems,
  justifyContent,
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
