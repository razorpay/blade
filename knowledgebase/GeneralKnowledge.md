# Blade General Knowledge

This file provides basic overview of blade along with common utility types that you will see in other parts of documentation

## What is Blade?

Blade is Razorpay's Design System to help you build UIs that are consistent with Razorpay's visual language.

Blade is comparitively restrictive than other design systems hence it won't support all the props that other component libraries or design systems do.

## How to build layouts in Blade?

### Box

Blade has Box component that is used to create general layouts. Check out Box documentation whenever you need to build layouts.

### Styled Props

Blade also supports limited styled props on several components to modify styles.

Styled Props are supported on components that use `StyledPropsBlade` type

#### StyledPropsBlade Type

These are the types that are supported in components that support styled props.

````ts
type LayoutProps = MakeObjectResponsive<
  {
    height: SpacingValueType;
    minHeight: SpacingValueType;
    maxHeight: SpacingValueType;
    width: SpacingValueType;
    minWidth: SpacingValueType;
    maxWidth: SpacingValueType;
  } & PickCSSByPlatform<
    'display' | 'overflow' | 'overflowX' | 'overflowY' | 'textAlign' | 'whiteSpace'
  >
>;

type MarginProps = MakeObjectResponsive<{
  /**
   * ### Margin Shorthand
   *
   * #### Usage
   *
   * ```jsx
   * margin="spacing.3"
   * margin="20px"
   * // margin={[top, right, bottom, left]}
   * margin={["spacing.3", "spacing.1", "spacing.0", "10px"]}
   *
   * // responsive
   * margin={{ base: 'spacing.2', m: 'spacing.7' }}
   * ```
   */
  margin: SpacingValueType | ArrayOfMaxLength4<SpacingValueType>;
  /**
   * ### Margin Horizontal
   *
   * #### Usage
   *
   * ```jsx
   * marginX="spacing.3"
   * marginX="20px"
   * ```
   */
  marginX: SpacingValueType;
  /**
   * ### Margin Vertical
   *
   * #### Usage
   *
   * ```jsx
   * marginY="spacing.3"
   * marginY="20px"
   * ```
   */
  marginY: SpacingValueType;
  marginTop: SpacingValueType;
  marginRight: SpacingValueType;
  marginBottom: SpacingValueType;
  marginLeft: SpacingValueType;
}>;

type FlexboxProps = MakeObjectResponsive<
  {
    gap: SpacingValueType;
    rowGap: SpacingValueType;
    columnGap: SpacingValueType;
    flex: string | number;
  } & PickCSSByPlatform<
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
    | 'placeItems'
    | 'order'
  >
>;

type PositionProps = MakeObjectResponsive<
  {
    top: SpacingValueType;
    right: SpacingValueType;
    bottom: SpacingValueType;
    left: SpacingValueType;
  } & PickCSSByPlatform<'position' | 'zIndex'>
>;

type GridProps = MakeObjectResponsive<
  PickCSSByPlatform<
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
    > &
    Pick<CSSProperties, 'display' | 'visibility'>
>;
````

#### Usage

```tsx
// vertical margin for button
<Button marginY="spacing.3" variant="primary">Hello, World</Button>

// responsive position
<Badge position={{base: 'relative', m: 'fixed'}}>
  Hello, World
</Badge>
```

## Common Utility Types

These are some of the common utility types that you will find in other parts of documentation.

- `TestID` - Used to add test ID to components for testing purposes.
- `DataAnalyticsAttribute` - Used to add data analytics attributes to components for analytics purposes.
- `StyledPropsBlade` - Used to add styled props to components.

````ts
type TestID = {
  /**
   * Test id that can be used to select element in testing environments
   *
   * Checkout https://testing-library.com/docs/queries/bytestid/
   */
  testID?: string;
};

/**
 * This type is used to add data-analytics attributes to components.
 * This is used to track user interactions on the components.
 * The key is always `data-analytics-` followed by the attribute name.
 * eg: `data-analytics-action="click"`
 * eg: `data-analytics-section="header"`
 */
type DataAnalyticsAttribute = {
  [key: `data-analytics-${string}`]: string;
};

/**
 * This type is used on different props on different components denote feedback
 */
type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';

type Spacing = Readonly<{
  /** 0: 0(px/rem/pt) */
  0: 0;
  /** 1: 2(px/rem/pt) */
  1: 2;
  /** 2: 4(px/rem/pt) */
  2: 4;
  /** 3: 8(px/rem/pt) */
  3: 8;
  /** 4: 12(px/rem/pt) */
  4: 12;
  /** 5: 16(px/rem/pt) */
  5: 16;
  /** 6: 20(px/rem/pt) */
  6: 20;
  /** 7: 24(px/rem/pt) */
  7: 24;
  /** 8: 32(px/rem/pt) */
  8: 32;
  /** 9: 40(px/rem/pt) */
  9: 40;
  /** 10: 48(px/rem/pt) */
  10: 48;
  /** 11: 56(px/rem/pt) */
  11: 56;
}>;

type SpacingValueType =
  | `spacing.${keyof Spacing}`
  | `${string}${SpaceUnits}`
  | `calc(${string})`
  | 'auto'
  | `min(${string})`
  | `max(${string})`
  | 'none'
  | 'initial'
  | 'fit-content'
  | 'max-content'
  | 'min-content';

// When type is `never`, we just want to return `never` rather than { base: never, ...etc } since that prop is intended to be never used
// Explaination of [T] extends [never] -> https://stackoverflow.com/questions/65492464/typescript-never-type-condition
type MakeValueResponsive<T> = [T] extends [never]
  ? never
  :
      | T
      | {
          // Using this instead of Record to maintain the jsdoc from breakpoints.ts
          [P in keyof Breakpoints]?: T;
        };

/**
 * Turns all the values in object into responsive object.
 *
 * ```ts
 * MakeObjectResponsive<{ hello: string}>
 *
 * // Outputs:
 * {
 *  hello: string | {
 *   base?: string;
 *   xs?: string;
 *   s?: string;
 *   // ... other breakpoints
 *  }
 * }
 * ```
 */
type MakeObjectResponsive<
  T,
  // using this workaround to preserve the jsdocs
  // https://github.com/microsoft/TypeScript/issues/31992
  K extends keyof T = Extract<keyof T, string>
> = {
  [P in K]: MakeValueResponsive<T[P]>;
};

export type Breakpoints = Readonly<{
  /**
   * `base` is used for responsive styling following a **mobile first** approach. It starts from 0px till the next existing token
   *
   * Think of this as styles without any media query.
   *
   * ### Example
   *
   * This code will set margin as `spacing.2` on "m" size screens and above. And as `spacing.1` on less than "m" size screens
   * ```jsx
   * <Box margin={{ base: 'spacing.1', m: 'spacing.2' }} />
   * ```
   *
   * This roughly translates into -
   *
   * ```
   * .Box {
   *  margin: 'spacing.1';
   * }
   *
   * ＠media screen and (min-width: 768px) {
   *  .Box {
   *    margin: 'spacing.2';
   *  }
   * }
   * ```
   */
  base: number;
  /**
   * `@media screen and (min-width: 320px)`
   *
   * Small Mobiles
   */
  xs: number;
  /**
   * `@media screen and (min-width: 480px)`
   *
   * Mobiles and Small Tablets
   */
  s: number;
  /**
   * `@media screen and (min-width: 768px)`
   *
   * Medium and Large Tablets.
   *
   * Dimensions with `m` and above can be treated as desktop in mobile-first approach (with min-width).
   * Hence this breakpoint can be used for desktop styling.
   *
   * E.g. next example will keep flexDirection `row` on mobiles and `column` on large tablets, desktop, and larger screens
   *
   * ```jsx
   * <Box display="flex" flexDirection={{ base: 'row', m: 'column' }} />
   * ```
   *
   */
  m: number;
  /**
   * `@media screen and (min-width: 1024px)`
   *
   * Desktop
   */
  l: number;
  /**
   * `@media screen and (min-width: 1200px)`
   *
   * HD Desktop
   */
  xl: number;
}>;

const breakpoints: Breakpoints = {
  base: 0,
  xs: 320,
  s: 480,
  m: 768,
  l: 1024,
  xl: 1200,
};
````
