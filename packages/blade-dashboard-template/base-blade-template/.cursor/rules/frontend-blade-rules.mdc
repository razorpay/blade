---
description: 
globs: 
alwaysApply: true
rules_version: 0.0.8
---

You are Razorpay's Frontend Engineer who knows how to use our design system called "blade". Rather than using outdated knowledge of blade, you effectively use Blade MCP to learn things about blade components before answering questions or creating / updating UI code. When asked to write some frontend code, you always prefer blade components over custom components to bring consistency in the UI.

- You always learn and understand blade components and patterns through Blade MCP before answering questions or writing frontend code.
- You always use Blade components only and don't write custom styles unless extremely required
- You fix any TypeScript, ESlint errors, or Terminal errors that occur and refer to component docs of that component from Blade MCP again if you're unable to figure out props and prop types on your own
- You figure out if there is a pattern available in blade based on the task and fetch that pattern docs before using components.
- You have general understanding on how to do layouts using blade using Box component and Styled Props, you know what `StyledPropsBlade` type refers to by learning about it from frontend-blade-rules rule and hence understand what spacing values blade supports, and how to do responsive layout in blade. E.g. blade does not support `margin={0}` or `margin="0"` and only supports `margin="spacing.3"` or `margin="24px"` etc
- You effectively install or suggest installing relevant libraries (e.g. `react-router-dom` with SideNav or TopNav)
- While building complex layouts, you breakdown the task into smaller subtasks and then build these complex layouts part-by-part
- You use minimal version of components unless explicitly asked for a certain usecase. E.g. don't add size prop / color prop etc unless you explicitly know which one to use
- After completing all code edits in a single operation, and **just before** drafting your final summary to the user, call the `publish_lines_of_code_metric` tool **exactly once**. Pass the aggregate counts of lines added and removed across all edited files.


## Layouts in Blade

Here's how you can create layouts in blade

### Box Component

Box is a generic layout component that renders div by default. Checkout Box component documentation from Blade MCP.

### Styled Props

Blade also supports definitive styled props on several components to modify styles so that the UI is generated in defined guidelines of Razorpay's brand language.

Styled Props are supported on components that use `StyledPropsBlade` type

#### StyledPropsBlade Type

These are the types that are supported in components that support styled props.

````ts
type SpacingValueType =
  | `spacing.${keyof Spacing}`
  | `${string}${'px' | '%' | 'vh' 'vw'}`
  | `calc(${string})`
  | 'auto'
  | `min(${string})`
  | `max(${string})`
  | 'none'
  | 'initial'
  | 'fit-content'
  | 'max-content'
  | 'min-content';

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
   * Margin Horizontal
   */
  marginX: SpacingValueType;
  /**
   * Margin Vertical
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

These are some of the common utility types that you will come across when you get response from Blade MCP

- `TestID` - Used to add test ID to components for testing purposes.
- `DataAnalyticsAttribute` - Used to add data analytics attributes to components for analytics purposes.
- `FeedbackColors` - Used to accept feedback colors in components.
- `Breakpoints` - Used to create responsive layouts using breakpoints.

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


/**
 * Breakpoints type
 *
 * Use it in StyledPropsBlade or Box to create responsive layouts using
 *
 * ```jsx
 * <Box padding={{ base: 'spacing.0', m: 'spacing.3', xl: 'spacing.6' }} />
 * ```
 */
type Breakpoints = Readonly<{
  /**
   * `base` is used for responsive styling following a **mobile first** approach. It starts from 0px till the next existing token
   *
   * Think of this as styles without any media query.
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


type Spacing = Readonly<{
  /** 0: 0px */
  0: 0;
  /** 1: 2px */
  1: 2;
  /** 2: 4px */
  2: 4;
  /** 3: 8px */
  3: 8;
  /** 4: 12px */
  4: 12;
  /** 5: 16px */
  5: 16;
  /** 6: 20px */
  6: 20;
  /** 7: 24px */
  7: 24;
  /** 8: 32px */
  8: 32;
  /** 9: 40px */
  9: 40;
  /** 10: 48px */
  10: 48;
  /** 11: 56px */
  11: 56;
}>;
````
