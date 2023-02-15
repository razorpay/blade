import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import type { Border, Spacing } from '~tokens/global';
import type { Breakpoints } from '~tokens/global/breakpoints';
import type { DotNotationColorStringToken } from '~src/_helpers/types';

type MakeValueResponsive<T> =
  | T
  | {
      // Using this instead of Record to maintain the jsdoc from breakpoints.ts
      [P in keyof Breakpoints]?: T;
    };
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
    height: SpacingValueType;
    minHeight: SpacingValueType;
    maxHeight: SpacingValueType;
    width: SpacingValueType;
    minWidth: SpacingValueType;
    maxWidth: SpacingValueType;
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
  >
>;

type ColorObjects = 'feedback' | 'surface' | 'action';
type BackgroundColorString<T extends ColorObjects> = `${T}.background.${DotNotationColorStringToken<
  Theme['colors'][T]['background']
>}`;

type BackgroundColorType =
  | BackgroundColorString<'feedback'>
  | BackgroundColorString<'surface'>
  | BackgroundColorString<'action'>
  | (string & Record<never, never>);

type VisualProps = MakeObjectResponsive<
  {
    borderRadius: keyof Border['radius'];
    backgroundColor: BackgroundColorType;
    background: BackgroundColorType;
  } & Pick<CSSObject, 'transform'>
>;

type StyleProps = Partial<
  // @todo: add placeSelf
  MarginProps &
    Pick<FlexboxProps, 'alignSelf' | 'justifySelf' | 'order'> &
    PositionProps &
    // @todo add column start, column end
    Pick<GridProps, 'gridColumn' | 'gridRow' | 'gridRowStart' | 'gridRowEnd' | 'gridArea'> & {
      children?: React.ReactNode | React.ReactNode[];
    }
>;

type BoxProps = Partial<
  PaddingProps &
    MarginProps &
    LayoutProps &
    FlexboxProps &
    PositionProps &
    GridProps & { children?: React.ReactNode | React.ReactNode[] }
>;

type BaseBoxProps = BoxProps &
  Partial<
    VisualProps & {
      className?: string;
      id?: string;
    }
  >;

export {
  BoxProps,
  StyleProps,
  BaseBoxProps,
  MakeValueResponsive,
  PaddingProps,
  MarginProps,
  SpacingValueType,
  ArrayOfMaxLength4,
};
