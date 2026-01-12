# React Component Discovery: Card

## Metadata

- Component Name: Card
- Component Path: `/Users/saurabh.daware/Desktop/projects/blade-monorepo/packages/blade/src/components/Card`
- Discovery Date: January 9, 2026

## File Structure

```
Card/
├── Card.tsx                          # Main Card component and CardBody
├── CardHeader.tsx                    # Header compound components and nested components
├── CardFooter.tsx                    # Footer compound components
├── CardRoot.web.tsx                  # Platform-specific root for web
├── CardRoot.native.tsx               # Platform-specific root for native
├── CardSurface.web.tsx               # Platform-specific surface for web
├── CardSurface.native.tsx            # Platform-specific surface for native
├── LinkOverlay.web.tsx               # Link overlay pattern for nested links (web only)
├── LinkOverlay.native.tsx            # Link overlay for native (not read but exists)
├── CardContext.tsx                   # Context for size management
├── types.ts                          # Type definitions
├── constants.ts                      # Constants for animations
├── index.ts                          # Public exports
├── Card.stories.tsx                  # Storybook stories
├── CardInteractive.stories.tsx       # Interactive card stories
├── InternalCardExample.tsx           # Internal examples
├── _KitchenSink.Card.stories.tsx     # Kitchen sink stories
├── __tests__/                        # Test files
│   ├── Card.web.test.tsx
│   ├── Card.native.test.tsx
│   ├── Card.ssr.test.tsx
│   ├── CardInteractive.web.test.tsx
│   └── CardInteractive.native.test.tsx
└── _decisions/                       # API decisions and design docs
    ├── decisions.md
    ├── interactive-cards.md
    ├── variants.md
    └── *.png (design images)
```

## Props Interface

### Main Card Props

```typescript
type CardProps = {
  // Content
  children: React.ReactNode;
  
  // Visual Styling
  backgroundColor?: CardSurfaceBackgroundColors; // surface.background.gray.* tokens
  borderRadius?: 'medium' | 'large' | 'xlarge';
  elevation?: keyof Elevation; // default: 'lowRaised'
  padding?: CardSpacingValueType; // default: 'spacing.7'
  
  // Layout
  width?: BoxProps['width'];
  height?: BoxProps['height'];
  minHeight?: BoxProps['minHeight'];
  minWidth?: BoxProps['minWidth'];
  maxWidth?: BoxProps['maxWidth'];
  
  // Interactive Features
  isSelected?: boolean; // Shows primary border when true
  href?: string; // Makes card linkable
  target?: string; // Link target attribute
  rel?: string; // Link rel attribute
  onClick?: (event: Platform.Select<{ web: React.MouseEvent; native: GestureResponderEvent }>) => void;
  onHover?: () => void;
  
  // Animations (Deprecated in v12)
  shouldScaleOnHover?: boolean; // Deprecated in favor of motion presets
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Sizing
  size?: 'large' | 'medium'; // Default: 'large', affects header title size
  
  // Advanced
  as?: 'label'; // Renders as label element for custom checkbox/radio
  cursor?: Platform.Select<{ web: CSSObject['cursor']; native: undefined }>;
} & TestID & DataAnalyticsAttribute & StyledPropsBlade;

// Spacing restricted to specific tokens
type CardSpacingValueType = Extract<
  SpacingValueType,
  'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'
>;
```

### CardBody Props

```typescript
type CardBodyProps = {
  children: React.ReactNode;
  height?: BoxProps['height'];
} & TestID & DataAnalyticsAttribute;
```

### CardHeader Props

```typescript
type CardHeaderProps = {
  children?: React.ReactNode;
  paddingBottom?: CardSpacingValueType; // Default: 'spacing.4'
  marginBottom?: CardSpacingValueType;  // Default: 'spacing.4'
  showDivider?: boolean;                // Default: true
} & TestID & DataAnalyticsAttribute;

type CardHeaderLeadingProps = {
  title: string;
  subtitle?: string;
  prefix?: React.ReactNode;  // Accepts CardHeaderIcon
  suffix?: React.ReactNode;  // Accepts CardHeaderCounter, CardHeaderLink
} & DataAnalyticsAttribute;

type CardHeaderTrailingProps = {
  visual?: React.ReactNode;  // Any visual ornament
};
```

### CardFooter Props

```typescript
type CardFooterProps = {
  children?: React.ReactNode;
  paddingTop?: CardSpacingValueType;   // Default: 'spacing.4'
  marginTop?: CardSpacingValueType;    // Default: 'spacing.4'
  showDivider?: boolean;               // Default: true
} & TestID & DataAnalyticsAttribute;

type CardFooterLeadingProps = {
  title?: string;
  subtitle?: string;
} & DataAnalyticsAttribute;

type CardFooterTrailingProps = {
  actions?: {
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
} & DataAnalyticsAttribute;

type CardFooterAction = Pick<
  ButtonProps,
  'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'
> & {
  text: ButtonProps['children'];
};
```

### Nested Components Props

```typescript
// CardHeaderIcon
{ icon: IconComponent }

// CardHeaderCounter
CounterProps // Passes through Counter props

// CardHeaderBadge
BadgeProps // Passes through Badge props

// CardHeaderAmount
AmountProps // Passes through Amount props

// CardHeaderText
TextProps<{ variant: TextVariant }> // Passes through Text props

// CardHeaderLink
LinkProps // Passes through Link props

// CardHeaderIconButton
Omit<ButtonProps, 'variant' | 'size' | 'iconPosition' | 'isFullWidth' | 'children'> & {
  icon: IconComponent;
}
```

## Component Dependencies

### Internal Blade Components
- **BaseBox** - Used as foundation for layout
- **Box** - For generic layout containers
- **Text** - For text content in headers and footers
- **Heading** - For header titles
- **Badge** - CardHeaderBadge
- **Counter** - CardHeaderCounter
- **Amount** - CardHeaderAmount
- **Link** - CardHeaderLink
- **Button** - For footer actions and CardHeaderIconButton
- **Divider** - For header/footer dividers
- **Icon** - CardHeaderIcon

### Utilities & Hooks
- `useVerifyAllowedChildren` - Validates child components
- `useVerifyInsideCard` - Ensures components used inside Card
- `useIsMobile` - Detects mobile viewport
- `useCheckboxGroupContext` - For checkbox group integration
- `useRadioGroupContext` - For radio group integration
- `metaAttribute` - Adds metadata attributes
- `makeAccessible` - Accessibility helpers
- `getStyledProps` - Styled props extraction
- `makeSpace` - Space calculations
- `makeMotionTime` - Motion timing utilities
- `castWebType` / `castNativeType` - Platform type casting
- `assignWithoutSideEffects` - Component ID assignment
- `makeAnalyticsAttribute` - Analytics tracking

### External Libraries
- **react** - Core React library
- **styled-components** - Styling solution
- **react-native** - Native platform (GestureResponderEvent, Linking, Pressable)
- **react-native-reanimated** - Native animations (Animated, useAnimatedStyle, withTiming)

### Context
- **CardContext** - Provides size ('large' | 'medium') to child components
- **CheckboxGroupContext** - Integration with checkbox groups
- **RadioGroupContext** - Integration with radio groups

## Styling Approach

### Styling Method
- **Primary**: styled-components
- Uses `styled()` to create styled component variants
- Platform-specific styling in separate files (web/native)

### Theme Tokens Used

**Colors:**
- `surface.background.gray.*` - Card background colors
- `surface.border.primary.normal` - Selected state border
- `surface.border.primary.muted` - Focus ring color
- `surface.border.gray.muted` - Default border (elevation: none)
- `surface.text.gray.normal` - Title text color
- `surface.text.gray.subtle` - Subtitle text color
- `surface.icon.gray.normal` - Icon color
- `interactive.border.negative.default` - Error state border
- `interactive.border.positive.default` - Success state border

**Spacing:**
- Limited to specific tokens: `spacing.0`, `spacing.3`, `spacing.4`, `spacing.5`, `spacing.7`
- Default padding: `spacing.7`
- Header/Footer margins: `spacing.4`

**Elevation:**
- Default: `lowRaised`
- Configurable via `elevation` prop
- When `elevation='none'`, shows thin border instead

**Border:**
- `border.width.thin` - For elevation: none
- `border.width.thicker` - For selected state
- `borderRadius`: medium (default), large, xlarge

**Motion:**
- `motion.duration.xquick` - Animation duration
- `motion.easing.standard` - Animation easing

### Dynamic Styles

**Selected State:**
- Box shadow with primary border color
- Border width: `thicker`
- Conditional based on `isSelected` prop

**Focused State:**
- Additional box shadow for focus ring
- Uses primary muted color
- 4px focus ring

**Validation States:**
- Error: negative border color
- Success: positive border color
- Integrates with CheckboxGroup/RadioGroup validation

**Hover State (Web):**
- Scale transform when `shouldScaleOnHover` enabled
- Transition on transform and box-shadow
- Scale up to 1.05 on hover

**Pressed State:**
- Mobile: Scale down to 0.95 on press
- Desktop: Scale down on mouse down

**Link Overlay:**
- Uses pseudo-element (::before) to cover entire card
- Z-index management for nested interactive elements
- Position: static for the overlay, relative for nested links/buttons

## Compound Components

### Primary Structure

```
Card (root container)
├── CardHeader (optional)
│   ├── CardHeaderLeading (required)
│   │   ├── prefix: CardHeaderIcon (optional)
│   │   ├── title + subtitle (required)
│   │   └── suffix: CardHeaderCounter | CardHeaderLink (optional)
│   └── CardHeaderTrailing (optional)
│       └── visual: CardHeaderBadge | CardHeaderText | CardHeaderAmount | CardHeaderIconButton
├── CardBody (required)
│   └── Any content
└── CardFooter (optional)
    ├── CardFooterLeading (optional)
    │   ├── title (optional)
    │   └── subtitle (optional)
    └── CardFooterTrailing (optional)
        └── actions: { primary, secondary } (optional)
```

### Component IDs (for validation)
- CardHeader
- CardHeaderTrailing
- CardHeaderLeading
- CardBody
- CardFooter
- CardFooterTrailing
- CardFooterLeading
- CardHeaderIcon
- CardHeaderCounter
- CardHeaderBadge
- CardHeaderAmount
- CardHeaderText
- CardHeaderLink
- CardHeaderIconButton

### Validation Rules
1. Card accepts: CardHeader, CardBody, CardFooter
2. CardHeader accepts: CardHeaderLeading, CardHeaderTrailing
3. CardFooter accepts: CardFooterLeading, CardFooterTrailing
4. CardHeaderLeading prefix accepts: CardHeaderIcon only
5. Context validation ensures all compound components used within Card

## Event Handlers

### onClick
- **Type**: `(event: Platform.Select<{ web: React.MouseEvent; native: GestureResponderEvent }>) => void`
- **Behavior**: 
  - Web: Applied to LinkOverlay button
  - Native: Applied to CardRoot Pressable
  - Creates LinkOverlay button when no href provided

### onHover
- **Type**: `() => void`
- **Platform**: Web only
- **Behavior**: Triggered on mouse enter

### Touch Events (Internal)
- **onTouchStart/End**: Press state management for mobile
- **onMouseDown/Up**: Press state management for desktop
- **onPressIn/Out**: Native press handling with Pressable

### Focus/Blur (Internal)
- **onFocus**: Sets focused state for focus ring
- **onBlur**: Removes focused state

## Special Features

### Animations

**Scale Animation (Deprecated):**
- **shouldScaleOnHover**: Deprecated in v12 in favor of motion presets
- **Scale values**: 
  - Up: 1.05 (hover on web)
  - Down: 0.95 (press on mobile/web)
- **Duration**: `theme.motion.duration.xquick`
- **Easing**: `theme.motion.easing.standard`
- **Native**: Uses react-native-reanimated with withTiming

**Migration to motion presets:**
```jsx
// Old
<Card shouldScaleOnHover />

// New
<Scale motionTriggers={['hover']}>
  <Card />
</Scale>
```

### Accessibility

**ARIA Attributes:**
- `accessibilityLabel`: Sets aria-label
- `aria-pressed`: Set when card is selected (non-link cards)
- `role="link"`: Automatic when href provided (native)
- Label role: When `as="label"` for custom form controls

**Focus Management:**
- Focus ring visible on keyboard navigation
- 4px blue focus indicator
- Focus/blur state tracking

**Keyboard Navigation:**
- Clickable cards are keyboard accessible
- Link overlay receives focus, not the card itself

### Responsive Behavior

**Mobile-First Layout:**
- CardFooter changes flexDirection:
  - Desktop: row (horizontal layout)
  - Mobile: column (vertical stack)
- Footer actions:
  - Desktop: marginLeft spacing between leading and trailing
  - Mobile: marginTop spacing

**Viewport Detection:**
- Uses `useIsMobile()` hook
- Different press animations for mobile vs desktop
- Hover effects disabled on mobile

### Platform-Specific Code

**Web (CardRoot.web.tsx):**
- Uses styled-components with CSS
- Hover and press states via CSS pseudo-classes
- LinkOverlay with anchor tag and pseudo-element
- Box-shadow for borders and focus ring

**Native (CardRoot.native.tsx):**
- Uses styled-components/native
- Press state with Animated component from reanimated
- AnimatedPressable for interactions
- Linking API for href navigation
- Border property instead of box-shadow

**LinkOverlay:**
- Web only (uses HTML anchor tag)
- Implements nested links pattern
- Z-index layering for interactive children

### Link Overlay Pattern

**Purpose:** Allows entire card to be clickable while maintaining nested interactive elements

**Implementation:**
- LinkOverlay renders as `<a>` or `<button>`
- Uses `position: static` with `::before` pseudo-element
- Pseudo-element covers entire card (position: absolute)
- Nested links/buttons elevated with z-index: 2
- Identified with `data-blade-component="card-link-overlay"`

**Behavior:**
- Card with `href`: LinkOverlay as anchor
- Card with `onClick` (no href): LinkOverlay as button
- No href/onClick: No LinkOverlay

### Context System

**CardContext:**
- Provides: `{ size: 'large' | 'medium' | undefined }`
- Used by: CardHeaderLeading to size title text
- Validation: All compound components verify they're inside Card

### Form Integration

**Checkbox/Radio Groups:**
- Reads CheckboxGroupContext and RadioGroupContext
- Applies validation state borders:
  - Error: negative border
  - Success: positive border
- Works with `as="label"` for custom form controls

## Migration Considerations

### Complexity: **High**

### Estimated Effort: **Large**

### Potential Challenges

1. **Platform-Specific Code:**
   - Separate implementations for web and native
   - Different animation libraries (CSS vs react-native-reanimated)
   - Svelte doesn't have platform-specific rendering like React Native
   - **Solution**: Focus on web implementation only

2. **Compound Component Pattern:**
   - Complex nested component validation
   - Context-based communication between components
   - Component ID tracking system
   - **Solution**: Use Svelte context API and slot validation

3. **Link Overlay Pattern:**
   - Relies on CSS pseudo-elements and z-index layering
   - Complex nested link handling
   - **Solution**: Similar pattern achievable in Svelte with `use:action` or wrapper elements

4. **Styled Components:**
   - Heavy use of styled-components with theme injection
   - Dynamic styling based on props and theme
   - **Solution**: Convert to Svelte's scoped styles with CSS variables or inline styles

5. **Animation System:**
   - Deprecated `shouldScaleOnHover` still supported
   - Transition to motion presets
   - State-based animations (pressed, hover)
   - **Solution**: Use Svelte transitions and animations API

6. **React Native Reanimated:**
   - Native platform uses different animation library
   - **Solution**: Skip native implementation, web only

7. **Context System:**
   - Size propagation through CardContext
   - Validation contexts from CheckboxGroup/RadioGroup
   - **Solution**: Svelte context API (`setContext`/`getContext`)

8. **Children Validation:**
   - `useVerifyAllowedChildren` enforces component hierarchy
   - `useVerifyInsideCard` ensures proper usage
   - **Solution**: Custom validation in Svelte using component registration

9. **StyledPropsBlade:**
   - Extensive styled props support
   - Responsive prop objects
   - **Solution**: Create Svelte equivalent or skip styled props initially

10. **ForwardRef Pattern:**
    - React forwardRef for ref forwarding
    - **Solution**: Svelte's `bind:this` is simpler

11. **Multiple Entry Points:**
    - Many sub-components exported
    - Nested component dependencies
    - **Solution**: Separate Svelte files, re-export from index

12. **TypeScript Complexity:**
    - Complex type unions and generics
    - Platform-specific types
    - **Solution**: Simplify types for web-only implementation

### Migration Priority

**Phase 1: Core Card**
- Card root component
- CardBody
- Basic props (backgroundColor, padding, elevation, borderRadius)
- Selected state

**Phase 2: Header/Footer**
- CardHeader, CardHeaderLeading, CardHeaderTrailing
- CardFooter, CardFooterLeading, CardFooterTrailing
- Dividers and spacing

**Phase 3: Nested Components**
- CardHeaderIcon, CardHeaderCounter, CardHeaderBadge
- CardHeaderText, CardHeaderLink, CardHeaderAmount, CardHeaderIconButton

**Phase 4: Interactions**
- onClick, href support
- LinkOverlay pattern
- Hover effects

**Phase 5: Advanced**
- Context system
- Validation
- Form integration (as="label")
- Analytics and accessibility

**Phase 6: Polish**
- Animations (scale effects)
- StyledPropsBlade support
- Responsive behavior
- Testing

### Key Dependencies to Migrate First
1. Box/BaseBox (foundational)
2. Text/Heading
3. Divider
4. Badge
5. Counter
6. Button
7. Link
8. Amount
9. Icon

### Testing Strategy
- Unit tests for each compound component
- Integration tests for component hierarchy validation
- Snapshot tests for different configurations
- Interactive tests for click/hover behaviors
- Accessibility tests (focus, keyboard navigation)
- SSR tests for server-side rendering
