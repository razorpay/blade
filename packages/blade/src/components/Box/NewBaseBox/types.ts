import type { CSSObject } from 'styled-components';
import type { Spacing } from '~tokens/global';
import type { Breakpoints } from '~tokens/global/breakpoints';

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

type VisualProps = MakeObjectResponsive<
  Pick<
    CSSObject,
    'backgroundColor' | 'borderRadius' | 'className' | 'id' | 'background' | 'transform'
  >
>;

type BaseBoxProps = Partial<
  PaddingProps &
    MarginProps &
    LayoutProps &
    FlexboxProps &
    PositionProps &
    GridProps &
    VisualProps & {
      children: React.ReactNode | React.ReactNode[];
    }
>;

export { BaseBoxProps, MakeValueResponsive };
