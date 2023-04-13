import type { CSSObject } from 'styled-components';
import type { MarginProps, PaddingProps, SpacingValueType } from './spacingTypes';
import type { MakeObjectResponsive } from './responsiveTypes';
import type { Theme } from '~components/BladeProvider';
import type { Border } from '~tokens/global';
import type { DotNotationColorStringToken, TestID } from '~src/_helpers/types';
import type { Platform } from '~src/utils/platform/platform';

type MakeObjectWebOnly<T> = {
  [P in keyof T]: Platform.Select<{ web: T[P]; native: never }>;
};

type LayoutProps = MakeObjectResponsive<
  {
    height: SpacingValueType;
    minHeight: SpacingValueType;
    maxHeight: SpacingValueType;
    width: SpacingValueType;
    minWidth: SpacingValueType;
    maxWidth: SpacingValueType;
  } & Pick<CSSObject, 'overflow' | 'overflowX' | 'overflowY'> &
    Platform.Select<{
      web: {
        /**
         *
         * On Web, The **`display`** CSS property sets whether an element is treated as a block or inline element and the layout used for its children, such as flow layout, grid or flex.
         *
         * @see https://developer.mozilla.org/docs/Web/CSS/display
         */
        display: CSSObject['display'];
      };
      native: {
        /**
         *
         *
         * On React Native, **`display`** property sets whether an element can be `flex` or `none`
         *
         * @see https://reactnative.dev/docs/layout-props.html#display
         *
         * @default 'flex'
         */
        display: 'none' | 'flex';
      };
    }>
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

type GridProps = MakeObjectWebOnly<
  MakeObjectResponsive<
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
  >
>;

type ColorObjects = 'feedback' | 'surface' | 'action';
type BackgroundColorString<T extends ColorObjects> = `${T}.background.${DotNotationColorStringToken<
  Theme['colors'][T]['background']
>}`;

// Created this as an array so I can reuse it for runtime validation
const validBoxAsValues = [
  'div',
  'section',
  'footer',
  'header',
  'main',
  'aside',
  'nav',
  'span',
] as const;

type BoxAsType = typeof validBoxAsValues[number];

type BaseBoxVisualProps = MakeObjectResponsive<
  {
    borderRadius: keyof Border['radius'];
    backgroundColor:
      | BackgroundColorString<'feedback'>
      | BackgroundColorString<'surface'>
      | BackgroundColorString<'action'>
      | (string & Record<never, never>);
    lineHeight: SpacingValueType;
  } & Pick<
    CSSObject,
    'transform' | 'border' | 'borderLeft' | 'borderRight' | 'borderTop' | 'borderBottom'
  >
>;

type BoxVisualProps = MakeObjectResponsive<{
  backgroundColor: BackgroundColorString<'surface'>;
}> & {
  // Intentionally keeping this outside of MakeObjectResponsive since we only want as to be string and not responsive object
  // styled-components do not support passing `as` prop as an object
  as: BoxAsType;
};

type StyledPropsBlade = Partial<
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
    BoxVisualProps & { children?: React.ReactNode | React.ReactNode[] } & TestID
>;

// Visual props have different types for BaseBox and Box. BaseBox has more flexible types and more props exposed.
// So first we Omit Visual props of Box
// Then we append BaseBoxVisualProps and some other props for styled-components like class and id
type BaseBoxProps = Omit<BoxProps, keyof BoxVisualProps> &
  Partial<
    BaseBoxVisualProps & {
      className?: string;
      id?: string;
    }
  >;

export { BaseBoxProps, BoxProps, StyledPropsBlade, validBoxAsValues };
