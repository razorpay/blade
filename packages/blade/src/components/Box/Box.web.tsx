import React from 'react';
import styled from 'styled-components';
import type { CSSObject } from 'styled-components';
import type { Spacing } from '~tokens/global';
import type { Breakpoints } from '~tokens/global/breakpoints';
import { makeSize } from '~utils';
import breakpoints from '~tokens/global/breakpoints';

type MakeValueResponsive<T> = T | Partial<Record<keyof Breakpoints | 'base', T>>;
type MakeObjectResponsive<T> = { [P in keyof T]: MakeValueResponsive<T[P]> };
type ArrayOfMaxLength4<T> = readonly [T?, T?, T?, T?];

type SpaceUnits = 'px' | 'fr' | '%' | 'rem' | 'em';
type SpacingValueType = `spacing.${keyof Spacing}` | `${string}${SpaceUnits}` | 'auto';

type PaddingProps = MakeObjectResponsive<{
  /**
   * Padding shorthand
   *
   * For token to pixel conversion, checkout -
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--page&globals=measureEnabled:false Spacing Token Ref}
   */
  padding: SpacingValueType | ArrayOfMaxLength4<SpacingValueType>;
  paddingX: SpacingValueType;
  paddingY: SpacingValueType;
  paddingTop: SpacingValueType;
  paddingRight: SpacingValueType;
  paddingBottom: SpacingValueType;
  paddingLeft: SpacingValueType;
}>;

type MarginProps = MakeObjectResponsive<{
  /**
   * Margin shorthand
   *
   * For token to pixel conversion, checkout -
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--page&globals=measureEnabled:false Spacing Token Ref}
   */
  margin: SpacingValueType | ArrayOfMaxLength4<SpacingValueType>;
  marginX: SpacingValueType;
  marginY: SpacingValueType;
  marginTop: SpacingValueType;
  marginRight: SpacingValueType;
  marginBottom: SpacingValueType;
  marginLeft: SpacingValueType;
}>;

type LayoutProps = MakeObjectResponsive<
  {
    width: SpacingValueType;
    height: SpacingValueType;
  } & Pick<CSSObject, 'display' | 'overflow'>
>;

type FlexboxProps = MakeObjectResponsive<
  {
    gap: SpacingValueType;
    rowGap: SpacingValueType;
    columnGap: SpacingValueType;
  } & Pick<
    CSSObject,
    | 'flex'
    | 'flexWrap'
    | 'flexDirection'
    | 'flexGrow'
    | 'flexShrink'
    | 'flexBasis'
    | 'alignItems'
    | 'alignContent'
    | 'alignSelf'
    | 'justifyItems'
    | 'justifyContent'
    | 'justifySelf'
    | 'order'
  >
>;

type PositionProps = MakeObjectResponsive<
  {
    top: SpacingValueType;
    right: SpacingValueType;
    bottom: SpacingValueType;
    left: SpacingValueType;
  } & Pick<CSSObject, 'position' | 'zIndex'>
>;

type GridProps = MakeObjectResponsive<
  Pick<
    CSSObject,
    | 'grid'
    | 'gridColumn'
    | 'gridRow'
    | 'gridRowStart'
    | 'gridRowEnd'
    | 'gridArea'
    | 'gridAutoFlow'
    | 'gridAutoRows'
    | 'gridAutoColumns'
    | 'gridTemplate'
    | 'gridTemplateAreas'
    | 'gridTemplateColumns'
    | 'gridTemplateRows'
    // @TODO: added for testing, remove later
    | 'backgroundColor'
  >
>;

type BoxProps = Partial<
  PaddingProps &
    MarginProps &
    LayoutProps &
    FlexboxProps &
    PositionProps &
    GridProps & {
      children: React.ReactNode | React.ReactNode[];
    }
>;

// @TODO: confirm about the breakpoints. Normally I've seen libraries only define breakpoints on min-width and be mobile-first
const getMediaQuery = ({ max, min }: { max?: number; min?: number }): string =>
  `@media screen${max ? ` and (max-width: ${makeSize(max)})` : ''}${
    min ? ` and (min-width: ${makeSize(min)})` : ''
  }`;

const getValue = <T extends string>(
  value: MakeValueResponsive<T> | undefined,
  size?: keyof Breakpoints,
): T | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  return value[size ?? 'base'];
};

// const getAllMediaQueries = (): Record<string, CSSObject> => {
//   return Object.entries(
//     breakpoints,
//   ).map(([breakpointKey, breakpointValue], index, breakpointsArray) => {
//     return [getMediaQuery({ max: breakpointsArray[index][1], min: breakpointsArray[index - 1][1] })]: {

//     }
//   });
// };

const getProps = (props: BoxProps, size?: keyof Breakpoints): CSSObject => {
  return {
    backgroundColor: getValue(props.backgroundColor, size),
  };
};

const getCSSObject = (props: BoxProps): CSSObject => {
  console.count('getCSSObject');
  return {
    ...getProps(props),
    [getMediaQuery({ max: breakpoints.xs })]: {
      ...getProps(props, 'xs'),
    },
    [getMediaQuery({ max: breakpoints.s, min: breakpoints.xs })]: {
      ...getProps(props, 's'),
    },
    [getMediaQuery({ max: breakpoints.m, min: breakpoints.s })]: {
      ...getProps(props, 'm'),
    },
    [getMediaQuery({ max: breakpoints.l, min: breakpoints.m })]: {
      ...getProps(props, 'l'),
    },
    [getMediaQuery({ max: breakpoints.xl, min: breakpoints.l })]: {
      ...getProps(props, 'xl'),
    },
    [getMediaQuery({ min: breakpoints.max })]: {
      ...getProps(props, 'max'),
    },
  };
};

const Box = styled.div<BoxProps>(
  (props): CSSObject => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const cssObject = React.useMemo(() => getCSSObject(props), [props.backgroundColor]);
    return cssObject;
  },
);

export { Box };
