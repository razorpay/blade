# React Component Discovery: Counter

## Metadata

- Component Name: Counter
- Component Path: `/Users/saurabh.daware/Desktop/projects/blade-monorepo/packages/blade/src/components/Counter/`
- Discovery Date: Friday Jan 9, 2026

## File Structure

```
Counter/
├── Counter.tsx                      # Main component implementation
├── types.ts                         # TypeScript type definitions for StyledCounter
├── index.tsx                        # Public exports
├── counterTokens.ts                 # Token definitions (height, padding, maxWidth)
├── getStyledCounterStyles.ts        # Shared styling logic across platforms
├── StyledCounter.web.tsx            # Web-specific styled component
├── StyledCounter.native.tsx         # React Native-specific styled component
├── Counter.stories.tsx              # Storybook stories and documentation
├── _KitchenSink.Counter.stories.tsx # Kitchen sink examples
├── _decisions/
│   ├── decisions.md                 # API decisions and design documentation
│   └── counter-thumbnail.png        # Design thumbnail
└── __tests__/
    ├── Counter.web.test.tsx         # Web platform tests
    ├── Counter.native.test.tsx      # Native platform tests
    ├── Counter.ssr.test.tsx         # SSR tests
    └── __snapshots__/               # Test snapshots
```

## Props Interface

```typescript
export type CounterProps = {
  /**
   * Sets the value for the counter.
   */
  value: number;
  /**
   * Sets the max value for the counter.
   * If value exceedes `max` it will render `value+`
   */
  max?: number;
  /**
   * Sets the color of the counter.
   *
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';
  /**
   * Sets the contrast of the counter.
   *
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;
  /**
   * Sets the size of the counter.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

// Supporting Types
type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
type SubtleOrIntense = 'subtle' | 'intense';
type TestID = { testID?: string; };
type DataAnalyticsAttribute = { [key: `data-analytics-${string}`]: string; };

// StyledCounter Internal Props
type StyledCounterProps = {
  backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
  size: NonNullable<CounterProps['size']>;
  platform: TypographyPlatforms;
  theme: Theme;
};
```

## Component Dependencies

### Internal Components
- `BaseBox` - Base layout component from `~components/Box/BaseBox`
- `Text` - Typography component from `~components/Typography`
- `StyledCounter` - Platform-specific styled component wrapper

### Utilities & Hooks
- `useTheme()` - Hook from `~components/BladeProvider` to access theme and platform
- `getStyledProps()` - Utility from `~components/Box/styledProps` for styled props
- `metaAttribute()` - Utility from `~utils/metaAttribute` for metadata attributes
- `makeAnalyticsAttribute()` - Utility from `~utils/makeAnalyticsAttribute` for analytics
- `assignWithoutSideEffects()` - Utility from `~utils/assignWithoutSideEffects` for assigning properties
- `isReactNative()` - Platform detection utility from `~utils`
- `makeSize()` - Size conversion utility from `~utils/makeSize`
- `makeBorderSize()` - Border size conversion utility from `~utils/makeBorderSize`
- `getIn()` - Lodash-like get utility from `~utils/lodashButBetter/get`

### External Libraries
- `react` - Core React library
- `styled-components` - For web styling
- `styled-components/native` - For React Native styling

## Styling Approach

- **Styling method**: styled-components (platform-specific)
  - `StyledCounter.web.tsx` - Uses `styled-components` with `width: 'fit-content'`
  - `StyledCounter.native.tsx` - Uses `styled-components/native` with `alignSelf: 'center'`
  
- **Theme tokens used**:
  - **Colors**: 
    - Feedback colors: `feedback.background.{color}.{emphasis}`, `feedback.text.{color}.intense`
    - Primary colors: `surface.background.primary.{emphasis}`, `surface.text.primary.normal`
    - Static colors: `surface.text.staticWhite.normal`
  - **Spacing**:
    - `spacing.2` (small padding)
    - `spacing.3` (medium/large padding)
  - **Size tokens**:
    - `size[16]` (small height - 16px)
    - `size[20]` (medium height - 20px)
    - `size[24]` (large height - 24px)
    - `size[100]` (mobile max width - 100px)
    - `size[120]` (desktop max width - 120px)
  - **Border**: `theme.border.radius.max` (fully rounded)

- **Dynamic styles**:
  - Background color and text color computed based on `color` and `emphasis` props via `getColorProps()`
  - Height determined by `size` prop via `counterHeight` token map
  - Horizontal padding determined by `size` prop via `horizontalPadding` token map
  - Max width varies by platform (mobile vs desktop)
  - Display mode changes by platform: `inline-flex` for web, `flex` for native

## Compound Components

No compound components. Counter is a single, standalone component.

## Event Handlers

No event handlers. Counter is a **non-interactive display component** that shows numerical values only.

## Special Features

- **Max value handling**: 
  - If `value > max`, displays `{max}+` (e.g., "99+" when value=120 and max=99)
  
- **Platform-specific rendering**:
  - Web: Uses `inline-flex` display and `width: fit-content`
  - Native: Uses `flex` display and `alignSelf: center`
  
- **Text truncation**: 
  - Uses `truncateAfterLines={1}` to prevent overflow
  
- **Responsive sizing**:
  - Three size variants: small, medium, large
  - Different text sizes per variant (xsmall, small, medium body text)
  - Font weight: `medium`
  
- **Color system**:
  - Supports 5 feedback colors: positive, negative, notice, information, neutral
  - Supports primary color
  - Two emphasis levels: subtle, intense
  - Different color combinations for primary vs feedback colors
  
- **Accessibility**: 
  - Uses semantic text component with proper color contrast
  - Includes `testID` for test automation
  - Supports `data-analytics-*` attributes for tracking
  - Metadata attributes via `metaAttribute()`

- **Styled Props Support**: 
  - Inherits `StyledPropsBlade` allowing margin, position, grid, and display styling
  - Enables flexible positioning and spacing in layouts

- **Ref forwarding**: 
  - Component forwards refs via `React.forwardRef` to `BladeElementRef`

## Migration Considerations

- **Complexity**: Low-Medium
  - Simple display component with no interactivity
  - Straightforward props and logic
  - Main complexity is in color/emphasis combinations and platform differences

- **Estimated effort**: Small
  - ~2-3 hours for basic Svelte implementation
  - Additional 1-2 hours for platform-specific adjustments if needed

- **Potential challenges**:
  1. **Platform-specific styling**: Need to handle web vs native differences in Svelte context (if applicable)
  2. **styled-components migration**: Convert to Svelte's native styling approach (CSS/SCSS with `:global()` or component styles)
  3. **Theme context access**: Need Svelte equivalent of `useTheme()` hook (likely via stores)
  4. **Color computation**: Port `getColorProps()` logic to Svelte (straightforward JS function)
  5. **Token access**: Ensure counterTokens and theme tokens are accessible in Svelte
  6. **Ref forwarding**: Svelte uses `bind:this` instead of React refs
  7. **StyledProps integration**: Need to implement Blade's styled props system in Svelte
  8. **BaseBox dependency**: Need Svelte version of BaseBox for layout
  9. **Text component**: Need Svelte Typography/Text component
  10. **Utility functions**: Port or reuse utility functions like `makeSize()`, `getIn()`, etc.

- **Key implementation notes**:
  - No state management needed (pure props-based rendering)
  - Content computation is simple: `value > max ? '${max}+' : '${value}'`
  - Color logic is deterministic based on props
  - No lifecycle hooks or side effects
  - Component is essentially a styled text display with calculated background and foreground colors

- **Testing considerations**:
  - Test all color × emphasis combinations (6 colors × 2 emphasis = 12 variants)
  - Test all 3 sizes
  - Test max value overflow behavior
  - Test styled props inheritance
  - Snapshot testing for visual regression
  - Platform-specific rendering tests (if applicable)
