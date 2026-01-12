# React Component Discovery: Badge

## Metadata

- Component Name: Badge
- Component Path: `/packages/blade/src/components/Badge/`
- Discovery Date: Friday Jan 9, 2026

## File Structure

```
Badge/
├── Badge.tsx                          # Main component implementation
├── types.ts                           # TypeScript type definitions
├── badgeTokens.ts                     # Design tokens (sizing, spacing, icons)
├── getStyledBadgeStyles.ts            # Styling logic (common)
├── StyledBadge.web.tsx                # Web-specific styled component
├── StyledBadge.native.tsx             # Native-specific styled component
├── index.tsx                          # Public exports
├── Badge.stories.tsx                  # Storybook stories
├── _KitchenSink.Badge.stories.tsx     # Additional story examples
├── __tests__/                         # Test files
│   ├── Badge.web.test.tsx
│   ├── Badge.native.test.tsx
│   ├── Badge.ssr.test.tsx
│   └── __snapshots__/
│       ├── Badge.web.test.tsx.snap
│       ├── Badge.native.test.tsx.snap
│       └── Badge.ssr.test.tsx.snap
└── _decisions/                        # Design decisions documentation
    ├── decisions.md
    ├── badge-differentiation.png
    └── badge-thumbnail.png
```

## Props Interface

```typescript
type BadgeProps = {
  /**
   * Sets the label for the badge.
   */
  children: StringChildrenType;
  
  /**
   * Sets the color of the badge.
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';
  
  /**
   * Sets the contrast of the badge.
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;
  
  /**
   * Sets the size of the badge.
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  
  /**
   * Icon to be displayed in the badge.
   * Accepts a component of type `IconComponent` from Blade.
   */
  icon?: IconComponent;
} & TestID & StyledPropsBlade & DataAnalyticsAttribute;

// Supporting Types
type ColorProps = {
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
  backgroundColor: StyledBadgeProps['backgroundColor'];
};

type StyledBadgeProps = {
  backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
  size: NonNullable<BadgeProps['size']>;
  theme: Theme;
};
```

### Props Details

- **children**: Required string content for the badge label. Validated at runtime to ensure non-empty string.
- **color**: Supports feedback colors (information, negative, neutral, notice, positive) + 'primary'. Controls badge color scheme.
- **emphasis**: 'subtle' (default) or 'intense'. Controls the color intensity/contrast.
- **size**: 'xsmall' | 'small' | 'medium' | 'large'. Controls badge height, padding, and icon size.
- **icon**: Optional IconComponent from Blade's icon library. Displayed before the text label.
- **testID**: Testing identifier for test selectors.
- **StyledPropsBlade**: Inherited styled props (margin, position, display, etc.)
- **DataAnalyticsAttribute**: Analytics tracking attributes (data-analytics-*)

## Component Dependencies

### Internal Components
- **BaseBox**: Core layout component used for wrapping and internal layout
- **Text**: Typography component for badge label
- **Icon Components**: Various icon components from `~components/Icons`
  - Used via IconComponent type
  - Icons are sized and colored dynamically

### Utilities & Hooks
- **metaAttribute**: Adds metadata attributes for component identification
- **getStyledProps**: Extracts and processes styled props from props
- **makeAnalyticsAttribute**: Creates analytics tracking attributes
- **getStringFromReactText**: Extracts string from React children
- **assignWithoutSideEffects**: Safely assigns properties without mutations
- **isReactNative**: Platform detection utility
- **makeSize**: Converts size values to platform-appropriate format
- **makeBorderSize**: Converts border radius values
- **throwBladeError**: Error handling utility
- **getIn**: Lodash-like utility for accessing nested object properties

### External Libraries
- **React**: Core React library (React.forwardRef, React.Ref)
- **styled-components**: Web styling (`styled-components`)
- **styled-components/native**: Native styling (`styled-components/native`)

## Styling Approach

- **Styling method**: styled-components with platform-specific implementations
  - `StyledBadge.web.tsx` - Web version with `width: 'fit-content'`
  - `StyledBadge.native.tsx` - Native version with `alignSelf: 'center'`
  
- **Theme tokens used**:
  - **Color tokens**: 
    - Surface colors: `surface.background.primary.{subtle|intense}`
    - Surface text: `surface.text.{staticWhite|primary}.normal`
    - Surface icon: `surface.icon.{staticWhite|primary}.normal`
    - Feedback colors: `feedback.background.{color}.{subtle|intense}`
    - Feedback text: `feedback.text.{color}.intense`
    - Feedback icon: `feedback.icon.{color}.intense`
  
  - **Spacing tokens**:
    - `spacing.0` to `spacing.4` for padding based on size
    - Horizontal padding varies by size (2px to 12px)
    - Icon padding varies by size (2px to 4px)
  
  - **Size tokens**:
    - Badge heights: 14px (xsmall), 16px (small), 20px (medium), 24px (large)
    - Icon sizes: 'xsmall' or 'small' depending on badge size
  
  - **Border tokens**:
    - Border radius: `theme.border.radius.max` (fully rounded corners)

- **Dynamic styles**:
  - Colors computed based on `color` and `emphasis` props via `getColorProps` function
  - Size-based scaling for height, padding, icon size, and text size
  - Platform-specific display: 'inline-flex' on web, 'flex' on native
  - Responsive layout with flexbox (centered, no-wrap)

## Compound Components

**None** - Badge is a standalone component without compound component pattern (no Badge.Icon, Badge.Label, etc.)

## Event Handlers

**None** - Badge is a purely presentational component with no built-in event handlers. Being a display component, it doesn't handle user interactions like click, hover, etc.

## Special Features

### Animations
- **No**: Badge is a static component without built-in animations or transitions

### Accessibility
- **Meta attributes**: Uses `metaAttribute` utility to add component identification for testing and debugging
- **Text truncation**: Label automatically truncates after 1 line to prevent overflow
- **Semantic HTML**: Uses flexbox layout with proper text alignment
- **No ARIA attributes**: Currently no specific ARIA attributes (as it's a presentational component)

### Responsive Behavior
- **Flexible width**: Badge adapts to content width (fit-content on web, auto on native)
- **Responsive props support**: Inherits StyledPropsBlade which supports responsive breakpoints
- **Text overflow handling**: Truncates text after 1 line with ellipsis
- **Flexible layout**: Internal flexbox ensures icon and text align properly

### Platform-specific Code
- **Display property**:
  - Web: `inline-flex` (allows inline placement with text)
  - Native: `flex` (block-level on native)
  
- **Width handling**:
  - Web: `width: 'fit-content'` (shrink to content)
  - Native: `alignSelf: 'center'` (center within parent)
  
- **styled-components imports**:
  - Web: `styled-components`
  - Native: `styled-components/native`
  
- **Ref handling**: Uses platform-specific ref types via `BladeElementRef`

### Additional Features
- **Dev mode validation**: Runtime validation ensures children text is non-empty
- **Forwardable refs**: Component uses React.forwardRef for ref forwarding
- **Component metadata**: Includes displayName and componentId for debugging
- **Analytics support**: Built-in analytics attribute support via DataAnalyticsAttribute
- **Theming**: Fully integrated with Blade theme system

## Migration Considerations

### Complexity
**Medium** - Not trivial but manageable

**Reasons:**
- Platform-specific implementations (web vs native)
- Complex color computation logic with nested token paths
- Multiple size configurations with associated tokens
- Styled-components dependency
- Theme system integration

### Estimated Effort
**Medium** (3-5 days)

**Breakdown:**
1. Core component logic - 1 day
2. Styling and theming integration - 1-2 days
3. Platform-specific implementations - 1 day
4. Testing and refinement - 0.5-1 day

### Potential Challenges

1. **styled-components to Svelte styling**
   - Need to convert styled-components CSS-in-JS to Svelte's style system
   - Platform detection logic needs adaptation for Svelte

2. **Theme token access**
   - Deep theme token access using dot notation paths (e.g., `feedback.background.neutral.subtle`)
   - Need equivalent theme context access in Svelte
   - Token interpolation logic needs conversion

3. **Ref forwarding**
   - React's forwardRef pattern needs Svelte equivalent using `bind:this`
   - BladeElementRef type adaptation required

4. **Dynamic color computation**
   - `getColorProps` function with complex conditional logic
   - Need to maintain same logic in Svelte reactivity system

5. **Icon component integration**
   - Icon prop accepts a React component type
   - Svelte uses different component composition pattern
   - Need to adapt IconComponent pattern to Svelte components

6. **Platform-specific builds**
   - Current implementation has separate files for web/native
   - Svelte migration needs strategy for platform-specific code

7. **Text truncation**
   - Uses Text component's `truncateAfterLines={1}` prop
   - Need equivalent in Svelte Text component

8. **Utility functions**
   - Many utility functions (makeSize, getStringFromReactText, etc.)
   - These utilities may need to be ported or adapted for Svelte

9. **Testing strategy**
   - Separate test suites for web, native, and SSR
   - Svelte testing approach differs from React testing

### Dependencies on Other Components

**Required components for Badge migration:**
- ✅ **BaseBox** - Core layout primitive
- ✅ **Text** - Typography component for label
- ✅ **Icon system** - Icon components and IconComponent type
- ✅ **Theme system** - Complete theme token access

### Migration Order Recommendation

Badge should be migrated **after** these core components:
1. Theme system and token utilities
2. BaseBox
3. Text component
4. Icon system

### Testing Requirements

- Unit tests for all size variants
- Unit tests for all color variants
- Unit tests for emphasis variants
- Icon integration tests
- Ref forwarding tests
- Platform-specific rendering tests
- Text truncation tests
- Styled props integration tests
- Analytics attribute tests

### Documentation Requirements

- Props API documentation
- Color system usage examples
- Size variant examples
- Icon integration examples
- Platform-specific notes
- Migration guide from React to Svelte version
