import React from 'react';
import styled from 'styled-components';
import type { CSSObject } from 'styled-components';
import type { Spacing } from '~tokens/global';
import type { Breakpoints } from '~tokens/global/breakpoints';
import breakpoints from '~tokens/global/breakpoints';
import { getMediaQuery } from '~src/utils/getMediaQuery';

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

const getAllProps = (props: BoxProps, size?: keyof Breakpoints): CSSObject => {
  return {
    backgroundColor: getValue(props.backgroundColor, size),
  };
};

const getAllMediaQueries = (props: BoxProps): CSSObject => {
  return Object.fromEntries(
    Object.entries(breakpoints).map((_val, index, breakpointsArray) => {
      const mediaQuery = `@media ${getMediaQuery(
        breakpointsArray as [keyof Breakpoints, number][],
        index,
      )}`;
      return [
        mediaQuery,
        {
          ...getAllProps(props, breakpointsArray[index][0] as keyof Breakpoints),
        },
      ];
    }),
  );
};

const getCSSObject = (props: BoxProps): CSSObject => {
  console.count('getCSSObject');
  return {
    ...getAllProps(props),
    ...getAllMediaQueries(props),
  };
};

const Box = styled.div<BoxProps>(
  (props): CSSObject => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const cssObject = React.useMemo(() => getCSSObject(props), [props.backgroundColor]);
    console.log(cssObject);
    return cssObject;
  },
);

export { Box };
