# React Component Discovery: Alert

## Metadata

- Component Name: Alert
- Component Path: `/Users/saurabh.daware/Desktop/projects/blade-monorepo/packages/blade/src/components/Alert`
- Discovery Date: Friday Jan 9, 2026

## File Structure

```
Alert/
├── Alert.tsx                    # Main component implementation
├── StyledAlert.tsx              # Styled component wrapper
├── types.ts                     # TypeScript type definitions for styled component
├── styles.ts                    # Styling logic and theme-based styling
├── index.ts                     # Public exports
├── Alert.stories.tsx            # Storybook stories
├── _KitchenSink.Alert.stories.tsx # Additional Storybook stories
├── _decisions/
│   ├── decisions.md             # API design decisions document
│   └── *.png                    # Design reference images
└── __tests__/
    ├── Alert.web.test.tsx       # Web platform tests
    ├── Alert.native.test.tsx    # Native platform tests
    ├── Alert.ssr.test.tsx       # Server-side rendering tests
    └── __snapshots__/           # Jest snapshots
```

## Props Interface

```typescript
type PrimaryAction = {
  text: string;
  onClick: () => void;
};

type SecondaryActionButton = {
  text: string;
  onClick: () => void;
};

type SecondaryActionLinkButton = {
  text: string;
  href: string;
  onClick?: () => void;
  target?: string;
  /**
   * When `target` is set to `_blank` this is automatically set to `noopener noreferrer`
   */
  rel?: string;
};

type SecondaryAction = SecondaryActionButton | SecondaryActionLinkButton;

type AlertProps = {
  /**
   * Body content, pass text or JSX. Avoid passing components except `Link` to customize the content.
   */
  description: ReactChild;

  /**
   * A brief heading
   */
  title?: string;

  /**
   * Shows a dismiss button
   *
   * @default true
   */
  isDismissible?: boolean;

  /**
   * A callback when the dismiss button is clicked
   */
  onDismiss?: () => void;

  /**
   * Can be used to render custom icon
   */
  icon?: IconComponent;

  /**
   * Can be set to `high` for a more prominent look. Not to be confused with a11y emphasis.
   *
   * @default subtle
   */
  emphasis?: SubtleOrIntense; // 'subtle' | 'intense'

  /**
   * Makes the Alert span the entire container width, instead of the default max width of `584px`.
   * This also makes the alert borderless, useful for creating full bleed layouts.
   *
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Sets the color tone
   */
  color?: FeedbackColors; // 'information' | 'positive' | 'negative' | 'notice' | 'neutral'

  /**
   * Renders a primary action button and a secondary action link button
   */
  actions?: {
    /**
     * Renders a button (should **always** be present if `secondary` action is being used)
     */
    primary?: PrimaryAction;
    /**
     * Renders a Link button
     */
    secondary?: SecondaryAction;
  };
} & TestID & StyledPropsBlade & DataAnalyticsAttribute;
```

## Component Dependencies

### Internal Components
- **BaseBox**: Layout wrapper component for flex/grid layouts
- **Icon**: Icon components used for feedback colors
  - `AlertOctagonIcon` (negative)
  - `AlertTriangleIcon` (notice)
  - `CheckCircleIcon` (positive)
  - `InfoIcon` (information/neutral)
  - `CloseIcon` (dismiss button)
- **IconButton**: Used for dismiss functionality
- **Text**: Typography component for title and description
- **BaseButton**: Primary action button
- **BaseLink**: Secondary action link button
- **StyledAlert**: Custom styled component extending BaseBox

### Utilities & Hooks
- **useBreakpoint**: Hook to detect device type (desktop/mobile)
- **useTheme**: Hook to access theme tokens
- **castNativeType/castWebType**: Platform-specific type casting utilities
- **getPlatformType**: Utility to detect platform (web/react-native)
- **getStyledProps**: Extracts and processes styled props
- **makeAccessible**: Accessibility helper for ARIA attributes
- **metaAttribute**: Metadata attributes for testing
- **makeAnalyticsAttribute**: Analytics tracking attributes
- **makeSpace**: Converts spacing tokens to CSS values
- **makeSize**: Converts size tokens to CSS values
- **makeBorderSize**: Converts border tokens to CSS values

### External Libraries
- **react**: Core React library (useState, forwardRef, Fragment)
- **styled-components**: CSS-in-JS styling library

## Styling Approach

- **Styling method**: styled-components with theme-based tokens
- **Styled component**: `StyledAlert` extends `BaseBox` component
- **Theme tokens used**:
  - Colors: `theme.colors.feedback.background[color][emphasis]`
  - Colors: `feedback.icon.{color}.{emphasis}`
  - Colors: `surface.text.gray.subtle` / `surface.text.staticWhite.normal`
  - Spacing: `theme.spacing[4]` for padding
  - Border radius: `theme.border.radius.medium` / `theme.border.radius.none`
  - Size: Global size token `584px` for max width
- **Dynamic styles**:
  - Background color changes based on `color` and `emphasis` props
  - Border radius set to `none` when `isFullWidth` is true
  - Max width restricted to 584px unless `isFullWidth` is true
  - Alignment changes based on `isFullWidth` and `isDesktop`
  - Icon alignment offset varies based on platform and layout configuration

## Compound Components

**None** - Alert is a single component with an object-based API for actions. The compound component pattern was considered but rejected in favor of better discoverability and constraint enforcement.

## Event Handlers

### Primary Event Handlers
- **onDismiss**: `() => void`
  - Called when user clicks the dismiss button
  - Component manages internal visibility state
  - Alert is hidden after dismissal (returns null)

### Action Event Handlers
- **actions.primary.onClick**: `() => void`
  - Triggered when primary action button is clicked
  - Required when primary action is provided

- **actions.secondary.onClick**: `() => void`
  - Triggered when secondary action is clicked/followed
  - Optional, works with both button and link variants

## Special Features

### Animations
- **No explicit animations**: Component uses immediate show/hide logic
- Dismiss action sets `isVisible` state to false, causing immediate unmount

### Accessibility
- **Web Platform**:
  - `role="alert"` for negative/notice colors (important, time-sensitive)
  - `role="status"` for information/positive/neutral (non-critical updates)
  - `aria-live="polite"` for notice intent (overrides implicit alert behavior)
  - Dismiss button has `aria-label="Dismiss alert"`
- **Native Platform**:
  - `accessibilityRole="alert"` (only role available on React Native)
  - Dismiss button has `accessibilityLabel="Dismiss alert"`

### Responsive Behavior
- **Breakpoint detection**: Uses `useBreakpoint` hook to determine desktop vs mobile
- **Layout changes**:
  - Actions rendered inline (horizontal) on desktop with `isFullWidth`
  - Actions stacked vertically on mobile or non-full-width layouts
- **Icon alignment**: Dynamic offset adjustments based on:
  - Platform (web vs native)
  - Device type (desktop vs mobile)
  - Layout mode (full-width vs constrained)
  - Presence of title

### Platform-specific Code
- **React Native differences**:
  - Uses special wrapper component (`CloseButtonWrapper`) for alignment
  - Icon offset calculations differ from web
  - Display prop casting: `flex` for native vs `inline-flex` for web
  - Only supports `alert` role (no `status` role)
- **Web-specific features**:
  - Secondary action supports `href`, `target`, `rel` attributes
  - More granular ARIA roles (alert vs status)

## Migration Considerations

### Complexity: **Medium**

### Estimated Effort: **Medium**

The Alert component has moderate complexity due to:
- Multiple conditional layouts and responsive behavior
- Platform-specific rendering logic
- Complex action handling with union types

### Potential Challenges

1. **Responsive Layout Logic**:
   - Complex conditional logic for icon alignment offsets
   - Desktop vs mobile layout switching
   - Horizontal vs vertical action layout

2. **Platform-Specific Code**:
   - React Native has different wrapper requirements
   - Icon offset calculations vary significantly between platforms
   - Type casting for platform-specific display values

3. **Action Handling Complexity**:
   - Union type for SecondaryAction (button vs link)
   - Type guards needed to distinguish between action types
   - Web-only link attributes (href, target, rel)

4. **Styled Components Migration**:
   - Need Svelte equivalent for styled-components
   - Theme token access pattern differs in Svelte
   - Dynamic style computation based on props

5. **State Management**:
   - Internal visibility state for dismiss functionality
   - Need to handle controlled dismissal with onDismiss callback

6. **Accessibility Implementation**:
   - Different ARIA attributes based on color/intent
   - Role switching between alert and status
   - Live region management

7. **Ref Forwarding**:
   - React's forwardRef pattern needs Svelte equivalent (bind:this)

8. **Type Safety**:
   - Complex union types for actions
   - Conditional prop requirements (e.g., secondary requires primary)
   - Generic event handler types

### Recommended Migration Strategy

1. **Phase 1**: Core component structure
   - Basic Alert with description and title
   - Color and emphasis variants
   - Icon rendering

2. **Phase 2**: Dismissal functionality
   - Close button rendering
   - Internal state management
   - onDismiss callback

3. **Phase 3**: Actions
   - Primary action button
   - Secondary action (button/link variants)
   - Type guards for action types

4. **Phase 4**: Responsive behavior
   - Breakpoint detection
   - Layout switching
   - Icon alignment adjustments

5. **Phase 5**: Platform-specific code
   - Web-specific features
   - Accessibility enhancements
   - Analytics integration

### Notes

- The component uses object-based API for actions instead of compound components for better discoverability and type safety
- Default max-width of 584px is enforced unless `isFullWidth` is true
- Secondary action should only be used with primary action (documented constraint, not enforced in TypeScript)
- Icon is automatically selected based on color, but can be overridden with custom icon
- The component is fully controlled for visibility after first dismiss
