# Common Utility Types

These are common utility types you will come across in Blade MCP responses.

- `TestID` - Used to add test ID to components for testing purposes.
- `DataAnalyticsAttribute` - Used to add data analytics attributes to components for analytics purposes.
- `FeedbackColors` - Used to accept feedback colors in components.
- `Breakpoints` - Used to create responsive layouts using breakpoints.

```ts
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
  /** `base` is used for responsive styling following a **mobile first** approach. Starts from 0px. */
  base: number;
  /** `@media screen and (min-width: 320px)` — Small Mobiles */
  xs: number;
  /** `@media screen and (min-width: 480px)` — Mobiles and Small Tablets */
  s: number;
  /** `@media screen and (min-width: 768px)` — Medium/Large Tablets. Use `m` and above for desktop styling. */
  m: number;
  /** `@media screen and (min-width: 1024px)` — Desktop */
  l: number;
  /** `@media screen and (min-width: 1200px)` — HD Desktop */
  xl: number;
}>;
```
