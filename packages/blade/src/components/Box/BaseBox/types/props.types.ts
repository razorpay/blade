import type { CSSObject } from 'styled-components';
import type { MarginProps, PaddingProps, SpacingValueType } from './spacing.types';
import type { MakeObjectResponsive } from './responsive.types';
import type { Theme } from '~components/BladeProvider';
import type { Border } from '~tokens/global';
import type { DotNotationColorStringToken } from '~src/_helpers/types';

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
    /**
     * This uses the native gap property which might not work on older browsers.
     * If you want to support older browsers, you might want to use `margin` instead.
     *
     * @see https://caniuse.com/?search=gap
     */
    gap: SpacingValueType;
    /**
     * This uses the native row-gap property which might not work on older browsers.
     * If you want to support older browsers, you might want to use `margin` instead.
     *
     * @see https://caniuse.com/?search=row-gap
     */
    rowGap: SpacingValueType;
    /**
     * This uses the native column-gap property which might not work on older browsers.
     * If you want to support older browsers, you might want to use `margin` instead.
     *
     * @see https://caniuse.com/?search=column-gap
     */
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
    | 'placeSelf'
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
    | 'gridColumnStart'
    | 'gridColumnEnd'
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

type BaseBoxVisualProps = MakeObjectResponsive<
  {
    borderRadius: keyof Border['radius'];
    backgroundColor:
      | BackgroundColorString<'feedback'>
      | BackgroundColorString<'surface'>
      | BackgroundColorString<'action'>
      | (string & Record<never, never>);
    lineHeight: SpacingValueType;
  } & Pick<CSSObject, 'transform'>
>;

type BoxVisualProps = MakeObjectResponsive<{
  backgroundColor: BackgroundColorString<'surface'>;
}>;

type StyledProps = Partial<
  MarginProps &
    Pick<FlexboxProps, 'alignSelf' | 'justifySelf' | 'placeSelf' | 'order'> &
    PositionProps &
    Pick<
      GridProps,
      | 'gridColumn'
      | 'gridRow'
      | 'gridRowStart'
      | 'gridRowEnd'
      | 'gridColumnStart'
      | 'gridColumnEnd'
      | 'gridArea'
    >
>;

type BoxProps = Partial<
  PaddingProps &
    MarginProps &
    LayoutProps &
    FlexboxProps &
    PositionProps &
    GridProps &
    BoxVisualProps & { children?: React.ReactNode | React.ReactNode[] }
>;

// Visual props have different types for BaseBox and Box.
// So first we Omit Visual props of Box
// Then we append BaseBoxVisualProps and some other props for styled-components like class and id
type BaseBoxProps = Omit<BoxProps, keyof BoxVisualProps> &
  Partial<
    BaseBoxVisualProps & {
      className?: string;
      id?: string;
    }
  >;

export { BaseBoxProps, BoxProps, StyledProps };
