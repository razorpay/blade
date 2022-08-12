import type { CSSObject } from 'styled-components';
import type { Theme } from '..';
import type { BoxProps } from './Box';
import { getIn, makeSize, makeSpace } from '~utils';

// allows 'auto' as spacing value
const getSpacingValue = <T extends string | number | undefined>({
  value,
  theme,
}: {
  value: T;
  theme: Theme;
}): string | undefined => {
  if (value === 'auto') return 'auto';
  if (typeof value === 'number') {
    return makeSpace(value);
  }
  return value ? makeSpace(getIn(theme, value)) : undefined;
};

const getBoxStyles = ({
  theme,
  display,
  flex,
  flexWrap,
  flexDirection,
  flexGrow,
  alignItems,
  justifyContent,
  alignSelf,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  gap,
  width,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  position,
  transform,
  top,
  left,
  right,
  bottom,
  zIndex,
}: BoxProps & { theme: Theme }): CSSObject => ({
  display,
  flex,
  flexWrap,
  flexGrow,
  flexDirection,
  alignItems,
  justifyContent,
  alignSelf,
  paddingTop: getSpacingValue({ value: paddingTop, theme }),
  paddingBottom: getSpacingValue({ value: paddingBottom, theme }),
  paddingLeft: getSpacingValue({ value: paddingLeft, theme }),
  paddingRight: getSpacingValue({ value: paddingRight, theme }),
  marginTop: getSpacingValue({ value: marginTop, theme }),
  marginBottom: getSpacingValue({ value: marginBottom, theme }),
  marginLeft: getSpacingValue({ value: marginLeft, theme }),
  marginRight: getSpacingValue({ value: marginRight, theme }),
  gap: getSpacingValue({ value: gap, theme }),
  width,
  minHeight: minHeight ? makeSize(minHeight) : undefined,
  minWidth: minWidth ? makeSize(minWidth) : undefined,
  maxHeight: maxHeight ? makeSize(maxHeight) : undefined,
  maxWidth: maxWidth ? makeSize(maxWidth) : undefined,
  position,
  transform,
  top,
  left,
  right,
  bottom,
  zIndex,
});

export default getBoxStyles;
